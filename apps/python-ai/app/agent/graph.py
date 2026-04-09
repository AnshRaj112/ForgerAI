from typing import TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph

from app.llm.providers import get_chat_model
from app.schemas import AgentExecutionRequest


class AgentState(TypedDict):
    agent_id: str
    prompt: str
    provider: str | None
    temperature: float | None
    output: str
    model: str
    trace: list[str]


def _run_llm(state: AgentState) -> AgentState:
    provider, model_name, chat_model = get_chat_model(state.get("provider"), state.get("temperature"))
    response = chat_model.invoke(
        [
            SystemMessage(
                content=(
                    "You are ForgeAI runtime agent. Reply with concise, practical output "
                    "for workflow execution."
                )
            ),
            HumanMessage(content=state["prompt"]),
        ]
    )
    content = response.content if isinstance(response.content, str) else str(response.content)

    next_trace = list(state.get("trace", []))
    next_trace.append(f"Executed llm node using {provider}/{model_name}")

    return {
        **state,
        "provider": provider,
        "model": model_name,
        "output": content,
        "trace": next_trace,
    }


def _finalize(state: AgentState) -> AgentState:
    next_trace = list(state.get("trace", []))
    next_trace.append("Finalized execution output")
    return {**state, "trace": next_trace}


def build_agent_graph():
    graph = StateGraph(AgentState)
    graph.add_node("llm_inference", _run_llm)
    graph.add_node("finalize", _finalize)
    graph.add_edge(START, "llm_inference")
    graph.add_edge("llm_inference", "finalize")
    graph.add_edge("finalize", END)
    return graph.compile()


def execute_agent(request: AgentExecutionRequest) -> AgentState:
    app = build_agent_graph()
    initial_state: AgentState = {
        "agent_id": request.agent_id,
        "prompt": request.prompt,
        "provider": request.provider,
        "temperature": request.temperature,
        "output": "",
        "model": "",
        "trace": ["Started LangGraph execution"],
    }
    return app.invoke(initial_state)
