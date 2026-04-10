# frozen_string_literal: true

bind "tcp://0.0.0.0:#{ENV.fetch('PORT', 4005)}"
environment ENV.fetch("RACK_ENV", "development")
workers Integer(ENV.fetch("PUMA_WORKERS", 1))
threads Integer(ENV.fetch("PUMA_THREADS_MIN", 2)), Integer(ENV.fetch("PUMA_THREADS_MAX", 8))
