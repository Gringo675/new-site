export default async () => {
  console.log(`from useCats`)
  return useFetch('/api/getCategories')
}
