export const useCanonical = () => {
  const route = useRoute()
  const { url: siteUrl } = useSiteConfig()

  const setCanonical = href => {
    useHead({
      link: [
        {
          rel: 'canonical',
          href: href,
        },
      ],
    })
  }

  watch(
    () => route.path,
    path => {
      setCanonical(path === '/' ? siteUrl : siteUrl + path)
    },
    { immediate: true },
  )
}
