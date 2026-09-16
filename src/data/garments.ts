export type GarmentType = 'camiseta' | 'sudadera'

export interface Garment {
  id: string
  type: GarmentType
  label: string
  price: number
  colorKey: string
  color: string
  swatch: string
  contrast: string
  image: string
  thumbnail: string
}

export const garmentCatalog: Garment[] = 
[
  {
    "id": "camiseta-sand",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "sand",
    "color": "Arena",
    "swatch": "#C2B280",
    "contrast": "#111214",
    "image": "/garments/camiseta-sand.webp",
    "thumbnail": "/garments/camiseta-sand-thumb.webp"
  },
  {
    "id": "camiseta-light-blue",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "light-blue",
    "color": "Azul claro",
    "swatch": "#87CEEB",
    "contrast": "#111214",
    "image": "/garments/camiseta-light-blue.webp",
    "thumbnail": "/garments/camiseta-light-blue-thumb.webp"
  },
  {
    "id": "camiseta-navy",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "navy",
    "color": "Azul marino",
    "swatch": "#14253D",
    "contrast": "#F5F5F2",
    "image": "/garments/camiseta-navy.webp",
    "thumbnail": "/garments/camiseta-navy-thumb.webp"
  },
  {
    "id": "camiseta-tropical-blue",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "tropical-blue",
    "color": "Azul tropical",
    "swatch": "#00A6D6",
    "contrast": "#111214",
    "image": "/garments/camiseta-tropical-blue.webp",
    "thumbnail": "/garments/camiseta-tropical-blue-thumb.webp"
  },
  {
    "id": "camiseta-white",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "white",
    "color": "Blanco",
    "swatch": "#F5F5F2",
    "contrast": "#111214",
    "image": "/garments/camiseta-white.webp",
    "thumbnail": "/garments/camiseta-white-thumb.webp"
  },
  {
    "id": "camiseta-charcoal",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "charcoal",
    "color": "Carbón",
    "swatch": "#36454F",
    "contrast": "#F5F5F2",
    "image": "/garments/camiseta-charcoal.webp",
    "thumbnail": "/garments/camiseta-charcoal-thumb.webp"
  },
  {
    "id": "camiseta-dark-chocolate",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "dark-chocolate",
    "color": "Chocolate",
    "swatch": "#3B241C",
    "contrast": "#F5F5F2",
    "image": "/garments/camiseta-dark-chocolate.webp",
    "thumbnail": "/garments/camiseta-dark-chocolate-thumb.webp"
  },
  {
    "id": "camiseta-daisy",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "daisy",
    "color": "Daisy",
    "swatch": "#F4D03F",
    "contrast": "#111214",
    "image": "/garments/camiseta-daisy.webp",
    "thumbnail": "/garments/camiseta-daisy-thumb.webp"
  },
  {
    "id": "camiseta-maroon",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "maroon",
    "color": "Granate",
    "swatch": "#800000",
    "contrast": "#F5F5F2",
    "image": "/garments/camiseta-maroon.webp",
    "thumbnail": "/garments/camiseta-maroon-thumb.webp"
  },
  {
    "id": "camiseta-ice-grey",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "ice-grey",
    "color": "Gris hielo",
    "swatch": "#D8DEE4",
    "contrast": "#111214",
    "image": "/garments/camiseta-ice-grey.webp",
    "thumbnail": "/garments/camiseta-ice-grey-thumb.webp"
  },
  {
    "id": "camiseta-cornsilk",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "cornsilk",
    "color": "Maíz",
    "swatch": "#FFF8DC",
    "contrast": "#111214",
    "image": "/garments/camiseta-cornsilk.webp",
    "thumbnail": "/garments/camiseta-cornsilk-thumb.webp"
  },
  {
    "id": "camiseta-purple",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "purple",
    "color": "Morado",
    "swatch": "#7C3AED",
    "contrast": "#F5F5F2",
    "image": "/garments/camiseta-purple.webp",
    "thumbnail": "/garments/camiseta-purple-thumb.webp"
  },
  {
    "id": "camiseta-orange",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "orange",
    "color": "Naranja",
    "swatch": "#F97316",
    "contrast": "#111214",
    "image": "/garments/camiseta-orange.webp",
    "thumbnail": "/garments/camiseta-orange-thumb.webp"
  },
  {
    "id": "camiseta-natural",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "natural",
    "color": "Natural",
    "swatch": "#E8DDC4",
    "contrast": "#111214",
    "image": "/garments/camiseta-natural.webp",
    "thumbnail": "/garments/camiseta-natural-thumb.webp"
  },
  {
    "id": "camiseta-black",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "black",
    "color": "Negro",
    "swatch": "#111214",
    "contrast": "#F5F5F2",
    "image": "/garments/camiseta-black.webp",
    "thumbnail": "/garments/camiseta-black-thumb.webp"
  },
  {
    "id": "camiseta-kelly-green",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "kelly-green",
    "color": "Verde Kelly",
    "swatch": "#4CBB17",
    "contrast": "#111214",
    "image": "/garments/camiseta-kelly-green.webp",
    "thumbnail": "/garments/camiseta-kelly-green-thumb.webp"
  },
  {
    "id": "camiseta-forest-green",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "forest-green",
    "color": "Verde bosque",
    "swatch": "#1E4D2B",
    "contrast": "#F5F5F2",
    "image": "/garments/camiseta-forest-green.webp",
    "thumbnail": "/garments/camiseta-forest-green-thumb.webp"
  },
  {
    "id": "camiseta-military-green",
    "type": "camiseta",
    "label": "Camiseta",
    "price": 25,
    "colorKey": "military-green",
    "color": "Verde militar",
    "swatch": "#4B5320",
    "contrast": "#F5F5F2",
    "image": "/garments/camiseta-military-green.webp",
    "thumbnail": "/garments/camiseta-military-green-thumb.webp"
  },
  {
    "id": "sudadera-adobe",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "adobe",
    "color": "Adobe",
    "swatch": "#B66A50",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-adobe.webp",
    "thumbnail": "/garments/sudadera-adobe-thumb.webp"
  },
  {
    "id": "sudadera-oatmeal-heather",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "oatmeal-heather",
    "color": "Avena jaspeada",
    "swatch": "#D8C6A8",
    "contrast": "#111214",
    "image": "/garments/sudadera-oatmeal-heather.webp",
    "thumbnail": "/garments/sudadera-oatmeal-heather-thumb.webp"
  },
  {
    "id": "sudadera-carolina-blue",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "carolina-blue",
    "color": "Azul Carolina",
    "swatch": "#56A9E3",
    "contrast": "#111214",
    "image": "/garments/sudadera-carolina-blue.webp",
    "thumbnail": "/garments/sudadera-carolina-blue-thumb.webp"
  },
  {
    "id": "sudadera-navy-blazer",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "navy-blazer",
    "color": "Azul blazer",
    "swatch": "#1F2A44",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-navy-blazer.webp",
    "thumbnail": "/garments/sudadera-navy-blazer-thumb.webp"
  },
  {
    "id": "sudadera-sky-blue",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "sky-blue",
    "color": "Azul cielo",
    "swatch": "#86C5E8",
    "contrast": "#111214",
    "image": "/garments/sudadera-sky-blue.webp",
    "thumbnail": "/garments/sudadera-sky-blue-thumb.webp"
  },
  {
    "id": "sudadera-team-royal",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "team-royal",
    "color": "Azul royal",
    "swatch": "#4169E1",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-team-royal.webp",
    "thumbnail": "/garments/sudadera-team-royal-thumb.webp"
  },
  {
    "id": "sudadera-white",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "white",
    "color": "Blanco",
    "swatch": "#F5F5F2",
    "contrast": "#111214",
    "image": "/garments/sudadera-white.webp",
    "thumbnail": "/garments/sudadera-white-thumb.webp"
  },
  {
    "id": "sudadera-khaki",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "khaki",
    "color": "Caqui",
    "swatch": "#B7A77A",
    "contrast": "#111214",
    "image": "/garments/sudadera-khaki.webp",
    "thumbnail": "/garments/sudadera-khaki-thumb.webp"
  },
  {
    "id": "sudadera-charcoal-heather",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "charcoal-heather",
    "color": "Carbón jaspeado",
    "swatch": "#666666",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-charcoal-heather.webp",
    "thumbnail": "/garments/sudadera-charcoal-heather-thumb.webp"
  },
  {
    "id": "sudadera-team-gold",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "team-gold",
    "color": "Dorado",
    "swatch": "#D4A853",
    "contrast": "#111214",
    "image": "/garments/sudadera-team-gold.webp",
    "thumbnail": "/garments/sudadera-team-gold-thumb.webp"
  },
  {
    "id": "sudadera-maroon",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "maroon",
    "color": "Granate",
    "swatch": "#800000",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-maroon.webp",
    "thumbnail": "/garments/sudadera-maroon-thumb.webp"
  },
  {
    "id": "sudadera-carbon-grey",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "carbon-grey",
    "color": "Gris carbono",
    "swatch": "#55595C",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-carbon-grey.webp",
    "thumbnail": "/garments/sudadera-carbon-grey-thumb.webp"
  },
  {
    "id": "sudadera-bone",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "bone",
    "color": "Hueso",
    "swatch": "#E3D7C6",
    "contrast": "#111214",
    "image": "/garments/sudadera-bone.webp",
    "thumbnail": "/garments/sudadera-bone-thumb.webp"
  },
  {
    "id": "sudadera-latte",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "latte",
    "color": "Latte",
    "swatch": "#C6A580",
    "contrast": "#111214",
    "image": "/garments/sudadera-latte.webp",
    "thumbnail": "/garments/sudadera-latte-thumb.webp"
  },
  {
    "id": "sudadera-lavender",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "lavender",
    "color": "Lavanda",
    "swatch": "#B9A7D9",
    "contrast": "#111214",
    "image": "/garments/sudadera-lavender.webp",
    "thumbnail": "/garments/sudadera-lavender-thumb.webp"
  },
  {
    "id": "sudadera-purple",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "purple",
    "color": "Morado",
    "swatch": "#7C3AED",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-purple.webp",
    "thumbnail": "/garments/sudadera-purple-thumb.webp"
  },
  {
    "id": "sudadera-black",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "black",
    "color": "Negro",
    "swatch": "#111214",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-black.webp",
    "thumbnail": "/garments/sudadera-black-thumb.webp"
  },
  {
    "id": "sudadera-vintage-black",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "vintage-black",
    "color": "Negro vintage",
    "swatch": "#282828",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-vintage-black.webp",
    "thumbnail": "/garments/sudadera-vintage-black-thumb.webp"
  },
  {
    "id": "sudadera-team-red",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "team-red",
    "color": "Rojo",
    "swatch": "#C94444",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-team-red.webp",
    "thumbnail": "/garments/sudadera-team-red-thumb.webp"
  },
  {
    "id": "sudadera-light-pink",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "light-pink",
    "color": "Rosa claro",
    "swatch": "#F4C2C2",
    "contrast": "#111214",
    "image": "/garments/sudadera-light-pink.webp",
    "thumbnail": "/garments/sudadera-light-pink-thumb.webp"
  },
  {
    "id": "sudadera-dusty-rose",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "dusty-rose",
    "color": "Rosa empolvado",
    "swatch": "#C98F8F",
    "contrast": "#111214",
    "image": "/garments/sudadera-dusty-rose.webp",
    "thumbnail": "/garments/sudadera-dusty-rose-thumb.webp"
  },
  {
    "id": "sudadera-forest-green",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "forest-green",
    "color": "Verde bosque",
    "swatch": "#1E4D2B",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-forest-green.webp",
    "thumbnail": "/garments/sudadera-forest-green-thumb.webp"
  },
  {
    "id": "sudadera-military-green",
    "type": "sudadera",
    "label": "Sudadera",
    "price": 35,
    "colorKey": "military-green",
    "color": "Verde militar",
    "swatch": "#4B5320",
    "contrast": "#F5F5F2",
    "image": "/garments/sudadera-military-green.webp",
    "thumbnail": "/garments/sudadera-military-green-thumb.webp"
  }
]
;
