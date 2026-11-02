import { describe, expect, it, vi } from 'vitest'
import { loadMenu } from './loadMenu.js'

function createClient({ settings = { id: 'settings-1' } } = {}) {
  const calls = []
  const responses = {
    categories: [{ id: 'category-1' }],
    products: [{ id: 'product-1' }],
    special_offers: [],
    our_story: [],
    site_settings: settings,
  }
  return {
    calls,
    collection: vi.fn((name) => ({
      getFullList: vi.fn((options) => {
        calls.push({ name, options })
        return Promise.resolve(responses[name])
      }),
      getFirstListItem: vi.fn(() => settings === null
        ? Promise.reject({ status: 404 })
        : Promise.resolve(settings)),
    })),
  }
}

describe('loadMenu', () => {
  it('loads menu collections and filters inactive items for visitors', async () => {
    const client = createClient()
    const menu = await loadMenu(client)

    expect(menu.categories).toEqual([{ id: 'category-1' }])
    expect(menu.products).toEqual([{ id: 'product-1' }])
    expect(menu.siteSettings).toEqual({ id: 'settings-1' })
    expect(client.calls.find(({ name }) => name === 'categories').options.filter).toBe('is_active = true')
    expect(client.calls.find(({ name }) => name === 'products').options.filter).toBe('is_available = true')
  })

  it('does not apply visitor filters for an admin and allows missing default settings', async () => {
    const client = createClient({ settings: null })
    const menu = await loadMenu(client, true)

    expect(menu.siteSettings).toBeNull()
    expect(client.calls.find(({ name }) => name === 'categories').options).not.toHaveProperty('filter')
    expect(client.calls.find(({ name }) => name === 'products').options).not.toHaveProperty('filter')
  })
})
