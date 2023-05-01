export default defineEventHandler(async event => {
  await checkToken(event, { adminOnly: true })

  // const query = `SELECT * FROM i_properties WHERE group_id=0 ORDER by group_id, ordering`
  const query = `SELECT * FROM i_properties ORDER by group_id, ordering`
  const rawProps = await dbReq(query)
  // разделим параметры на группы
  const propsGroups = [
    // порядковый номер соостветствует group_id
    'p0_brand',
    'p1_type',
    'p2_counting_system',
    'p3_range',
    'p4_size',
    'p5_accuracy',
    'p6_class',
    'p7_feature',
    'p8_pack',
  ]

  const props = {}
  for (const groupName of propsGroups) {
    props[groupName] = []
  }

  for (const prop of rawProps) {
    props[propsGroups[prop.group_id]].push(prop)
  }
  return props
})
