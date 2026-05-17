import { supabase } from './supabase'

function toJS(row) {
  return {
    id: row.id,
    address: row.address,
    district: row.district,
    price: row.price,
    size: row.size,
    rooms: row.rooms,
    floor: row.floor,
    totalFloors: row.total_floors,
    year: row.year,
    energy: row.energy,
    broker: row.broker,
    kfw: row.kfw,
    url: row.url,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  }
}

function toDB(listing) {
  return {
    address: listing.address,
    district: listing.district,
    price: listing.price,
    size: listing.size,
    rooms: listing.rooms,
    floor: listing.floor,
    total_floors: listing.totalFloors,
    year: listing.year,
    energy: listing.energy,
    broker: listing.broker,
    kfw: listing.kfw,
    url: listing.url,
    notes: listing.notes,
    status: listing.status,
  }
}

export async function loadListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(toJS)
}

export async function addListing(listing) {
  const { data, error } = await supabase
    .from('listings')
    .insert(toDB(listing))
    .select()
    .single()
  if (error) throw error
  return toJS(data)
}

export async function updateStatus(id, status) {
  const { error } = await supabase
    .from('listings')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function deleteListing(id) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function checkDuplicate(address) {
  const { count, error } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('address', address)
  if (error) throw error
  return count > 0
}
