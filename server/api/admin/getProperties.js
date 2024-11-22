export default defineEventHandler(async event => {
  // const query = `SELECT * FROM i_properties WHERE group_id=0 ORDER by group_id, ordering`
  const query = `SELECT * FROM i_properties ORDER by group_id, ordering`
  const rawProps = await dbReq(query)
  // разделим параметры на группы
  const propsGroups = usePropsGroups()

  const props = {}
  for (const groupName of propsGroups) {
    props[groupName] = []
  }

  for (const prop of rawProps) {
    props[propsGroups[prop.group_id]].push(prop)
  }
  return props
})
