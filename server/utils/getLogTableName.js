const config = useRuntimeConfig()

export default () => {
  return 'i_log'
  return config.public.PROD_MODE ? 'i_log' : 'i_log_test'
}
