// todo: move to /cms/
export default defineEventHandler(async event => {
  //
  const table = 'i_properties2'
  // const query = `SELECT * FROM i_properties WHERE group_id=0 ORDER by group_id, ordering`
  const query = `SELECT * FROM ${table} ORDER by group_id, ordering`
  const rawProps = await dbReq(query)
  // разделим параметры на группы
  const propsGroups = usePrpsGroupsMap().keys().toArray()

  const props = {}
  for (const groupName of propsGroups) {
    props[groupName] = []
  }

  for (const prop of rawProps) {
    props[propsGroups[prop.group_id]].push(prop)
  }
  return props
})
