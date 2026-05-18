import { supabase } from './supabase'

function requireClient() {
  if (!supabase) throw new Error("Supabase not configured. Copy .env.example to .env.local")
  return supabase
}

function normalizeEv(ev) {
  if (!ev) return null
  if (ev.vt) return ev
  var out = {
    verdict: ev.verdict,
    vt: ev.verdictText || ev.vt || "",
    building: ev.summary ? ev.summary.building : ev.building,
    unit: ev.summary ? ev.summary.unit : ev.unit,
    transit: ev.summary ? ev.summary.transit : ev.transit,
    schools: ev.summary ? ev.summary.schools : ev.schools,
    parks: ev.summary ? ev.summary.parks : ev.parks,
    hausgeld: ev.hausgeld,
    pros: ev.pros,
    cons: ev.cons,
    qs: ev.questions || ev.qs,
    eq: ev.ausstattung || ev.eq,
  }
  if (ev.hardChecks) {
    out.hc = ev.hardChecks.map(function(h) { return [h.name, h.pass, h.detail] })
  } else {
    out.hc = ev.hc
  }
  return out
}

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
    created: row.created_at,
    evaluation: normalizeEv(row.ev),
  }
}

function toDB(listing) {
  var row = {
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
    ev: listing.evaluation || listing.ev || null,
  }
  if (listing.created) row.created_at = listing.created
  return row
}

export async function loadListings() {
  const { data, error } = await requireClient()
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(toJS)
}

export async function addListing(listing) {
  const { data, error } = await requireClient()
    .from('listings')
    .insert(toDB(listing))
    .select()
    .single()
  if (error) throw error
  return toJS(data)
}

export async function updateStatus(id, status) {
  const { error } = await requireClient()
    .from('listings')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

export async function deleteListing(id) {
  const { error } = await requireClient()
    .from('listings')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function checkDuplicate(address) {
  const { count, error } = await requireClient()
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('address', address)
  if (error) throw error
  return count > 0
}
