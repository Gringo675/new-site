export default async () => {
  // use on admin pages that don't load initial data from the server /api/admin/* endpoints

  return myFetch('/api/admin/isAdmin')
}
