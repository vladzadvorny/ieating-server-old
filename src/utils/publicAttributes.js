import _ from 'lodash'

export const filterPublicAttributes = (obj, { rawAttributes }) => {
  const attributes = Object.keys(rawAttributes).filter(
    item => item === 'id' || rawAttributes[item].public
  )

  return _.pick(obj, attributes)
}
