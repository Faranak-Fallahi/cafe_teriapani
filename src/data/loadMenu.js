export function loadMenu(client, isAdmin = false) {
  const siteSettingsRequest = client.collection('site_settings')
    .getFirstListItem('slug = "default"')
    .catch((error) => {
      if (error.status === 404) return null
      throw error
    })

  return Promise.all([
    client.collection('categories').getFullList({
      sort: 'sort_order',
      ...(isAdmin ? {} : { filter: 'is_active = true' }),
    }),
    client.collection('products').getFullList({
      sort: 'name',
      expand: 'categories',
      ...(isAdmin ? {} : { filter: 'is_available = true' }),
    }),
    client.collection('special_offers').getFullList({ filter: 'is_active = true', sort: 'name' }),
    client.collection('our_story').getFullList({ sort: 'sort_order' }),
    siteSettingsRequest,
  ]).then(([categories, products, offers, story, siteSettings]) => ({ categories, products, offers, story, siteSettings }))
}
