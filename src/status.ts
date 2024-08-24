export interface GeoMap {
  id: string,
  sites: SiteMap[]
}

export interface SiteMap {
  id: string, // country id
  states: StateMap[]
}

export interface StateMap {
  id: string, // state id
  name: string, // state name
  cities: {[city: string]: string[]} 
}

export interface Listing {
  id: string,
  t: string,
  dp: string,
  f: string,
  l: string,
  y: number
}

export interface Status {
  "lookup": {
    "regions": {[key: string]: string},
    "sites": {[key: string]: string},
    "locations": {[key: string]: string},
    "departments": {[key: string]: string},
    "types": {[key: string]: string},
  },
  "departments": {[key: string]: string[]},
  "listings": Listing[], 
  "geo": GeoMap[]
}
