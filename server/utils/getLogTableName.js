const config = useRuntimeConfig()

export default () => {
  return config.public.PROD_MODE ? 'i_log' : 'i_log_test'
}
