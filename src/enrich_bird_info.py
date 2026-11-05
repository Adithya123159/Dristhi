import json
import os

BIRD_DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'app', 'bird_info.json')

# Rich curated metadata for the 100 Indian bird species
ENRICHMENT = {
    "000.Indian_Peafowl": {
        "scientific_name": "Pavo cristatus",
        "family": "Phasianidae",
        "conservation_status": "Least Concern (LC)",
        "habitat": "Deciduous forests, scrub jungles, agricultural plains, and village edges.",
        "diet": "Omnivorous — seeds, insects, small reptiles, berries, and grains.",
        "physical_characteristics": "National bird of India. Males boast iridescent blue necks with an elaborate train of eye-spotted tail covert feathers up to 2 meters long.",
        "geographical_distribution": "Throughout the Indian Subcontinent south of the Himalayas.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Peacock_Plumage.jpg/640px-Peacock_Plumage.jpg"
    },
    "001.Indian_Roller": {
        "scientific_name": "Coracias benghalensis",
        "family": "Coraciidae",
        "conservation_status": "Least Concern (LC)",
        "habitat": "Open grasslands, agricultural cultivated fields, roadside trees, and dry deciduous scrub.",
        "diet": "Carnivorous — primarily ground beetles, crickets, grasshoppers, moths, and small frogs.",
        "physical_characteristics": "State bird of multiple Indian states. Renowned for its breathtaking turquoise and dark ultramarine blue wing patterns displayed during aerobatic courtship flights.",
        "geographical_distribution": "Widespread resident across mainland India.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Indian_roller_%28Coracias_benghalensis_benghalensis%29.jpg/640px-Indian_roller_%28Coracias_benghalensis_benghalensis%29.jpg"
    },
    "002.Great_Indian_Bustard": {
        "scientific_name": "Ardeotis nigriceps",
        "family": "Otididae",
        "conservation_status": "Critically Endangered (CR)",
        "habitat": "Arid and semi-arid grasslands, shrublands, and desert fringes.",
        "diet": "Omnivorous — grass seeds, insects, beetles, locusts, lizards, and small snakes.",
        "physical_characteristics": "One of the heaviest flying birds on Earth (up to 15 kg). Tall, ostrich-like stance with a black crown on its head and pale neck.",
        "geographical_distribution": "Severely fragmented; primarily found in the Thar Desert (Rajasthan) and Kutch (Gujarat).",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Great_Indian_Bustard_male_crop.jpg/640px-Great_Indian_Bustard_male_crop.jpg"
    },
    "003.House_Sparrow": {
        "scientific_name": "Passer domesticus",
        "family": "Passeridae",
        "conservation_status": "Least Concern (LC)",
        "habitat": "Urban landscapes, rural villages, farms, and suburban gardens.",
        "diet": "Granivorous & insectivorous — seeds, grains, table crumbs, and caterpillars for chicks.",
        "physical_characteristics": "Compact passerine bird. Males feature a rich chestnut brown back, grey crown, and bold black throat bib.",
        "geographical_distribution": "Ubiquitous across India and introduced worldwide.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Passer_domesticus_male_1%28Thirunelly%29.jpg/640px-Passer_domesticus_male_1%28Thirunelly%29.jpg"
    },
    "004.Asian_Koel": {
        "scientific_name": "Eudynamys scolopaceus",
        "family": "Cuculidae",
        "conservation_status": "Least Concern (LC)",
        "habitat": "Light woodlands, gardens, cultivated orchards, and leafy city parks.",
        "diet": "Frugivorous & omnivorous — wild figs, papayas, berries, and insect larvae.",
        "physical_characteristics": "Brood parasite known for its loud 'koo-ooo' call. Males are glossy blue-black with ruby-red eyes; females are speckled and barred brown.",
        "geographical_distribution": "All Indian states and across South Asia.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Asian_Koel_Male_I_IMG_2456.jpg/640px-Asian_Koel_Male_I_IMG_2456.jpg"
    },
    "005.Rose-ringed_Parakeet": {
        "scientific_name": "Psittacula krameri",
        "family": "Psittaculidae",
        "conservation_status": "Least Concern (LC)",
        "habitat": "Woodlands, farmlands, gardens, urban parks, and temple groves.",
        "diet": "Herbivorous — seeds, grain, fruits, berries, and nectar.",
        "physical_characteristics": "Bright emerald green plumage with a very long graduated tail. Adult males show a distinctive rose-pink and black neck ring.",
        "geographical_distribution": "Abundant throughout India.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rose-ringed_parakeet_%28Psittacula_krameri_manillensis%29_male.jpg/640px-Rose-ringed_parakeet_%28Psittacula_krameri_manillensis%29_male.jpg"
    },
    "006.Red-vented_Bulbul": {
        "scientific_name": "Pycnonotus cafer",
        "family": "Pycnonotidae",
        "conservation_status": "Least Concern (LC)",
        "habitat": "Secondary scrub, gardens, open forests, hedges, and city foliage.",
        "diet": "Frugivorous & insectivorous — soft fruits, berries, flower nectar, and flying insects.",
        "physical_characteristics": "Dark crest on black head with scale-like pattern on chest, and an unmistakable bright crimson-red undertail patch (vent).",
        "geographical_distribution": "Native to entire Indian subcontinent.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Red-vented_Bulbul_%28Pycnonotus_cafer%29_in_Kolkata_I_IMG_8604.jpg/640px-Red-vented_Bulbul_%28Pycnonotus_cafer%29_in_Kolkata_I_IMG_8604.jpg"
    },
    "007.Indian_Robin": {
        "scientific_name": "Copsychus fulicatus",
        "family": "Muscicapidae",
        "conservation_status": "Least Concern (LC)",
        "habitat": "Dry open stony scrublands, agricultural borders, rocky outcrops, and village edges.",
        "diet": "Insectivorous — termites, ants, beetles, spiders, and insect pupae.",
        "physical_characteristics": "Small songbird that perches with its tail cocked upright. Males are glossy black with a white shoulder patch and chestnut-brown undertail coverts.",
        "geographical_distribution": "Endemic to the Indian Subcontinent.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Indian_robin_%28Copsychus_fulicatus_cambaiensis%29_male.jpg/640px-Indian_robin_%28Copsychus_fulicatus_cambaiensis%29_male.jpg"
    },
    "008.Jungle_Babbler": {
        "scientific_name": "Argya striata",
        "family": "Leiothrichidae",
        "conservation_status": "Least Concern (LC)",
        "habitat": "Deciduous forest, dry scrub, gardens, orchards, and thorn groves.",
        "diet": "Omnivorous — insects, spiders, grain, nectar, and fallen seeds.",
        "physical_characteristics": "Popularly nicknamed 'Seven Sisters' because they always forage in noisy, social family groups of six to ten individuals.",
        "geographical_distribution": "Common resident throughout the Indian Peninsula.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Jungle_babbler_%28Argya_striata_orientalis%29_composite.jpg/640px-Jungle_babbler_%28Argya_striata_orientalis%29_composite.jpg"
    },
    "009.Common_Myna": {
        "scientific_name": "Acridotheres tristis",
        "family": "Sturnidae",
        "conservation_status": "Least Concern (LC)",
        "habitat": "Human settlements, agricultural fields, pastures, and city centers.",
        "diet": "Omnivorous — insects, fruit, scraps, grains, and earthworms.",
        "physical_characteristics": "Medium brown bird with a black hooded head, yellow eye patches, bright yellow bill and legs, and white wing patches visible in flight.",
        "geographical_distribution": "Ubiquitous throughout India.",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Common_myna_%28Acridotheres_tristis_tristis%29.jpg/640px-Common_myna_%28Acridotheres_tristis_tristis%29.jpg"
    }
}

# Scientific names and families lookup for remaining species
LOOKUP = {
    "Brahminy Kite": ("Haliastur indus", "Accipitridae", "Least Concern (LC)", "Coastlines, rivers, lakes, flooded estuaries", "Scavenger/Carnivore - fish, crabs, carrion"),
    "Black Kite": ("Milvus migrans", "Accipitridae", "Least Concern (LC)", "Urban cities, garbage dumps, lakes, fields", "Scavenger - rodents, refuse, insects"),
    "Shikra": ("Accipiter badius", "Accipitridae", "Least Concern (LC)", "Open forests, savanna, agricultural groves", "Carnivore - lizards, small birds, rodents"),
    "White-throated Kingfisher": ("Halcyon smyrnensis", "Alcedinidae", "Least Concern (LC)", "Wetlands, paddy fields, irrigation canals, dry plains", "Carnivore - crabs, frogs, lizards, fish"),
    "Common Kingfisher": ("Alcedo atthis", "Alcedinidae", "Least Concern (LC)", "Clear streams, rivers, ponds, reed beds", "Piscivore - small fish, aquatic insects"),
    "Pied Kingfisher": ("Ceryle rudis", "Alcedinidae", "Least Concern (LC)", "Lakes, estuaries, large rivers, reservoirs", "Piscivore - fish, hovers mid-air before diving"),
    "Green Bee-eater": ("Merops orientalis", "Meropidae", "Least Concern (LC)", "Grasslands, farmlands, dry scrub, open country", "Insectivore - bees, wasps, dragonflies, flies"),
    "Indian Golden Oriole": ("Oriolus kundoo", "Oriolidae", "Least Concern (LC)", "Deciduous canopy, mango orchards, tree groves", "Frugivore/Insectivore - figs, caterpillars"),
    "Black Drongo": ("Dicrurus macrocercus", "Dicruridae", "Least Concern (LC)", "Open agricultural fields, scrublands, wire perches", "Insectivore - moths, grasshoppers, winged termites"),
    "Ashy Drongo": ("Dicrurus leucophaeus", "Dicruridae", "Least Concern (LC)", "Hill forests, bamboo stands, plantation edges", "Insectivore - flying insects captured in air"),
    "Greater Coucal": ("Centropus sinensis", "Cuculidae", "Least Concern (LC)", "Dense scrub, hedges, tall grassland marshes", "Carnivore - caterpillars, snails, eggs, lizards"),
    "Sarus Crane": ("Antigone antigone", "Gruidae", "Vulnerable (VU)", "Wetlands, flooded marshes, agricultural paddy lands", "Omnivore - tubers, seeds, aquatic frogs, snails"),
    "Painted Stork": ("Mycteria leucocephala", "Ciconiidae", "Near Threatened (NT)", "Shallow freshwater wetlands, marshes, reservoirs", "Piscivore - fish, crustaceans, frogs"),
    "Asian Openbill": ("Anastomus oscitans", "Ciconiidae", "Least Concern (LC)", "Freshwater lakes, seasonal floodplains, marshes", "Molluscivore - apple snails, freshwater mussels"),
    "Black-headed Ibis": ("Threskiornis melanocephalus", "Threskiornithidae", "Near Threatened (NT)", "Inland wetlands, tidal mudflats, flooded paddy", "Carnivore - frogs, fish, crabs, worms"),
    "Red-wattled Lapwing": ("Vanellus indicus", "Charadriidae", "Least Concern (LC)", "Plains near water, dry stream beds, pastures", "Insectivore - beetles, grubs, mollusks"),
    "White-breasted Waterhen": ("Amaurornis phoenicurus", "Rallidae", "Least Concern (LC)", "Marshes, ponds, ditches, dense reed thickets", "Omnivore - shoots, seeds, insects, small mollusks"),
    "Common Moorhen": ("Gallinula chloropus", "Rallidae", "Least Concern (LC)", "Vegetated lakes, marshy ponds, slow rivers", "Omnivore - aquatic vegetation, seeds, water bugs"),
    "Purple Sunbird": ("Cinnyris asiaticus", "Nectariniidae", "Least Concern (LC)", "Gardens, open scrub, flowering groves, parks", "Nectarivore/Insectivore - floral nectar, spiders"),
    "Crimson Sunbird": ("Aethopyga siparaja", "Nectariniidae", "Least Concern (LC)", "Himalayan foothills, evergreen forests, gardens", "Nectarivore - nectar, small spiders, flies"),
    "Baya Weaver": ("Ploceus philippinus", "Ploceidae", "Least Concern (LC)", "Grasslands, thorn trees near water, crop fields", "Granivore - grass seeds, cultivated cereals"),
    "Indian Silverbill": ("Euodice malabarica", "Estrildidae", "Least Concern (LC)", "Dry scrub, thorn bushes, savannah grasslands", "Granivore - weed and grass seeds"),
    "Scaly-breasted Munia": ("Lonchura punctulata", "Estrildidae", "Least Concern (LC)", "Paddy fields, grasslands, secondary scrub", "Granivore - seeds, grains, weed buds"),
    "Plum-headed Parakeet": ("Psittacula cyanocephala", "Psittaculidae", "Least Concern (LC)", "Moist deciduous forests, wooded valleys, fruit trees", "Frugivore/Granivore - wild figs, seeds, berries"),
    "Alexandrine Parakeet": ("Psittacula eupatria", "Psittaculidae", "Near Threatened (NT)", "Old-growth forests, plantations, tree groves", "Frugivore - fruits, seeds, nuts, nectar"),
    "Spotted Owlet": ("Athene brama", "Strigidae", "Least Concern (LC)", "Open country, village groves, tree hollows, ruins", "Carnivore - beetles, locusts, mice, geckos"),
    "Barn Owl": ("Tyto alba", "Tytonidae", "Least Concern (LC)", "Old buildings, church spires, barns, rural ruins", "Carnivore - rats, mice, shrews, small birds"),
    "Indian Eagle-Owl": ("Bubo bengalensis", "Strigidae", "Least Concern (LC)", "Rocky ravines, arid scrub, ancient quarry walls", "Carnivore - rodents, hares, peafowl chicks"),
    "Brown Fish Owl": ("Ketupa zeylonensis", "Strigidae", "Least Concern (LC)", "Wooded streams, freshwater lakes, canal banks", "Piscivore - freshwater fish, crabs, frogs"),
    "Jungle Owlet": ("Glaucidium radiatum", "Strigidae", "Least Concern (LC)", "Moist and dry deciduous forests, teak plantations", "Carnivore - grasshoppers, cicadas, lizards"),
    "Coppersmith Barbet": ("Psilopogon haemacephalus", "Megalaimidae", "Least Concern (LC)", "Gardens, groves, open woodlands, ficus trees", "Frugivore - wild figs, berries, flower petals"),
    "Brown-headed Barbet": ("Psilopogon zeylanicus", "Megalaimidae", "Least Concern (LC)", "Forest fringes, city parks, fruit orchards", "Frugivore - figs, cultivated fruits, insects"),
    "Lineated Barbet": ("Psilopogon lineatus", "Megalaimidae", "Least Concern (LC)", "Dense deciduous forests, Himalayan foothills", "Frugivore - banyan figs, drupes, beetles"),
    "Indian Grey Hornbill": ("Ocyceros birostris", "Bucerotidae", "Least Concern (LC)", "Deciduous plains, avenue trees, gardens", "Frugivore - figs, berries, occasional lizards"),
    "Malabar Pied Hornbill": ("Anthracoceros coronatus", "Bucerotidae", "Near Threatened (NT)", "Riverine evergreen forests, moist deciduous woods", "Frugivore - forest canopy fruits, small vertebrates"),
    "Great Hornbill": ("Buceros bicornis", "Bucerotidae", "Vulnerable (VU)", "Pristine dense rainforest canopy, hill forests", "Frugivore - large forest fruits, snakes, nestlings"),
    "Rufous Treepie": ("Dendrocitta vagabunda", "Corvidae", "Least Concern (LC)", "Dry deciduous woodland, scrub, gardens, groves", "Omnivore - fruits, insects, lizards, carrion"),
    "House Crow": ("Corvus splendens", "Corvidae", "Least Concern (LC)", "Cities, towns, markets, coastal villages", "Omnivore - human scraps, food waste, carrion"),
    "Jungle Crow": ("Corvus culminatus", "Corvidae", "Least Concern (LC)", "Forests, hills, agricultural clearings, suburbs", "Omnivore - small animals, fruit, carrion"),
    "Common Tailorbird": ("Orthotomus sutorius", "Cisticolidae", "Least Concern (LC)", "Gardens, hedgerows, scrub, urban greenery", "Insectivore - aphids, caterpillars, beetles"),
    "Ashy Prinia": ("Prinia socialis", "Cisticolidae", "Least Concern (LC)", "Grasslands, gardens, crop margins, marsh edges", "Insectivore - small flies, beetles, aphids"),
    "Plain Prinia": ("Prinia inornata", "Cisticolidae", "Least Concern (LC)", "Paddy fields, reed beds, open marshy scrub", "Insectivore - insects, spiders, larvae"),
    "Oriental Magpie-Robin": ("Copsychus saularis", "Muscicapidae", "Least Concern (LC)", "Gardens, open broadleaf forest, cultivated lands", "Insectivore - worms, beetles, leeches, grubs"),
    "White-rumped Shama": ("Copsychus malabaricus", "Muscicapidae", "Least Concern (LC)", "Dense undergrowth, bamboo ravines, moist forests", "Insectivore - beetles, caterpillars, berries"),
    "Indian Paradise Flycatcher": ("Terpsiphone paradisi", "Monarchidae", "Least Concern (LC)", "Shady riverine woods, bamboo groves, plantations", "Insectivore - flying insects snapped mid-flight"),
    "Tickell's Blue Flycatcher": ("Cyornis tickelliae", "Muscicapidae", "Least Concern (LC)", "Dry scrub, forest undergrowth, bamboo clumps", "Insectivore - flies, beetles, winged termites"),
    "Verditer Flycatcher": ("Eumyias thalassinus", "Muscicapidae", "Least Concern (LC)", "Himalayan hill slopes, wintering in plains forests", "Insectivore - aerial insects caught on the wing"),
    "Grey-headed Canary-Flycatcher": ("Culicicapa ceylonensis", "Stenostiridae", "Least Concern (LC)", "Hill forests, shaded tree canopies, stream ravines", "Insectivore - gnats, small flies, midges"),
    "Red-whiskered Bulbul": ("Pycnonotus jocosus", "Pycnonotidae", "Least Concern (LC)", "Orchards, hill gardens, forest scrub, town foliage", "Frugivore - berries, small fruits, flower buds"),
    "White-browed Bulbul": ("Pycnonotus luteolus", "Pycnonotidae", "Least Concern (LC)", "Dry thorny scrub, roadside hedges, village gardens", "Frugivore - lantana berries, figs, spiders"),
    "Yellow-billed Babbler": ("Argya affinis", "Leiothrichidae", "Least Concern (LC)", "Dry lowlands, scrub, coastal thickets, gardens", "Omnivore - ground insects, nectar, berries"),
    "Puff-throated Babbler": ("Pellorneum ruficeps", "Pellorneidae", "Least Concern (LC)", "Forest understory, ravine bamboo, leaf litter", "Insectivore - leaf litter invertebrates, grubs"),
    "Indian White-eye": ("Zosterops palpebrosus", "Zosteropidae", "Least Concern (LC)", "Flowering canopy trees, gardens, secondary forests", "Nectarivore/Frugivore - flower nectar, berries"),
    "Cinereous Tit": ("Parus cinereus", "Paridae", "Least Concern (LC)", "Open woodlands, gardens, hill groves, thorn bush", "Insectivore - caterpillars, small spiders, seeds"),
    "Black-lored Tit": ("Machlolophus aplonotus", "Paridae", "Least Concern (LC)", "Broadleaf hill forests, pine woods, coffee estates", "Insectivore - tree bark insects, pine seeds"),
    "Purple-rumped Sunbird": ("Leptocoma zeylonica", "Nectariniidae", "Least Concern (LC)", "Gardens, mangrove margins, flowering hedges", "Nectarivore - nectar from hibiscus, moringa"),
    "Loten's Sunbird": ("Cinnyris lotenius", "Nectariniidae", "Least Concern (LC)", "Coastal scrub, dry deciduous woods, estates", "Nectarivore - long corolla floral nectar"),
    "Thick-billed Flowerpecker": ("Dicaeum agile", "Dicaeidae", "Least Concern (LC)", "Dry deciduous woodland, mistletoe clumps", "Frugivore - mistletoe berries, spiders, nectar"),
    "Pale-billed Flowerpecker": ("Dicaeum erythrorhynchos", "Dicaeidae", "Least Concern (LC)", "Avenue trees, orchards, gardens, canopy foliage", "Frugivore - parasitic mistletoe berries"),
    "Crested Serpent Eagle": ("Spilornis cheela", "Accipitridae", "Least Concern (LC)", "Dense wooded hills, riverine forests, savannas", "Carnivore - venomous snakes, frogs, lizards"),
    "Changeable Hawk-Eagle": ("Nisaetus cirrhatus", "Accipitridae", "Least Concern (LC)", "Forested plains, woodland borders, hill tracts", "Carnivore - pheasants, tree squirrels, lizards"),
    "Steppe Eagle": ("Aquila nipalensis", "Accipitridae", "Endangered (EN)", "Open plains, arid scrub, garbage dumps during winter", "Carnivore - rodents, carrion, injured birds"),
    "Indian Vulture": ("Gyps indicus", "Accipitridae", "Critically Endangered (CR)", "Rocky cliff faces, temple ramparts, open plains", "Scavenger - cattle and mammalian carcasses"),
    "Egyptian Vulture": ("Neophron percnopterus", "Accipitridae", "Endangered (EN)", "Arid plains, cliff faces, village dumps, towns", "Scavenger - refuse, bone marrow, dung, eggs"),
    "Red-headed Vulture": ("Sarcogyps calvus", "Accipitridae", "Critically Endangered (CR)", "Dry deciduous foothills, grasslands, river gorges", "Scavenger - large animal carcasses"),
    "Osprey": ("Pandion haliaetus", "Pandionidae", "Least Concern (LC)", "Large reservoirs, coastlines, lagoons, rivers", "Piscivore - live fish snatched from water surface"),
    "Peregrine Falcon": ("Falco peregrinus", "Falconidae", "Least Concern (LC)", "Cliff faces, high towers, coastal bluffs, gorges", "Carnivore - pigeons, ducks, waders caught mid-air"),
    "Common Kestrel": ("Falco tinnunculus", "Falconidae", "Least Concern (LC)", "Open grasslands, moorlands, road verges, fields", "Carnivore - mice, voles, lizards, beetles"),
    "Indian Courser": ("Cursorius coromandelicus", "Glareolidae", "Least Concern (LC)", "Stony plains, fallow fields, semi-desert scrub", "Insectivore - beetles, grasshoppers, termites"),
    "Yellow-wattled Lapwing": ("Vanellus malabaricus", "Charadriidae", "Least Concern (LC)", "Dry stony scrublands, open fell grounds", "Insectivore - beetles, grasshoppers, worms"),
    "Pheasant-tailed Jacana": ("Hydrophasianus chirurgus", "Jacanidae", "Least Concern (LC)", "Floating vegetation lakes, lotus marshes", "Omnivore - water bugs, seeds, aquatic snails"),
    "Bronze-winged Jacana": ("Metopidius indicus", "Jacanidae", "Least Concern (LC)", "Lily-covered tanks, marsh lagoons, weed pools", "Insectivore - snails, insects on floating leaves"),
    "Black-winged Stilt": ("Himantopus himantopus", "Recurvirostridae", "Least Concern (LC)", "Salt pans, marshy margins, shallow lakes", "Carnivore - aquatic invertebrates, larvae, worms"),
    "Great Thick-knee": ("Esacus recurvirostris", "Burhinidae", "Near Threatened (NT)", "Gravel riverbanks, lake margins, shingle shoals", "Carnivore - freshwater crabs, mollusks, frogs"),
    "Indian Skimmer": ("Rynchops albicollis", "Laridae", "Endangered (EN)", "Broad sandy river channels, sand spits, estuaries", "Piscivore - small fish scooped from water surface"),
    "River Tern": ("Sterna aurantia", "Laridae", "Vulnerable (VU)", "Inland broad rivers, freshwater lakes, reservoirs", "Piscivore - small fish, freshwater crustaceans"),
    "Whiskered Tern": ("Chlidonias hybrida", "Laridae", "Least Concern (LC)", "Marshlands, paddy fields, seasonal lakes, tanks", "Insectivore/Piscivore - dragonflies, small fish"),
    "Little Egret": ("Egretta garzetta", "Ardeidae", "Least Concern (LC)", "Rivers, wetlands, tidal pools, marshes, mudflats", "Piscivore - small fish, frogs, crustaceans"),
    "Great Egret": ("Ardea alba", "Ardeidae", "Least Concern (LC)", "Marshes, reservoirs, estuaries, flood plains", "Piscivore - fish, amphibians, water snakes"),
    "Intermediate Egret": ("Ardea intermedia", "Ardeidae", "Least Concern (LC)", "Flooded paddy fields, reed-fringed ponds, mudflats", "Piscivore - small fish, frogs, aquatic insects"),
    "Cattle Egret": ("Bubulcus ibis", "Ardeidae", "Least Concern (LC)", "Pastures, grazing livestock fields, trash dumps", "Insectivore - grasshoppers, flies, ticks on cattle"),
    "Indian Pond Heron": ("Ardeola grayii", "Ardeidae", "Least Concern (LC)", "Village ponds, marshy ditches, water channels", "Piscivore - tadpoles, fish, water bugs, crabs"),
    "Grey Heron": ("Ardea cinerea", "Ardeidae", "Least Concern (LC)", "Rivers, lakes, tidal shallows, reservoirs", "Piscivore - fish, frogs, small eels, water voles"),
    "Purple Heron": ("Ardea purpurea", "Ardeidae", "Least Concern (LC)", "Dense reedbeds, overgrown swamps, marshy lagoons", "Piscivore - fish, marsh frogs, water snakes"),
    "Black-crowned Night Heron": ("Nycticorax nycticorax", "Ardeidae", "Least Concern (LC)", "Vegetated water bodies, mangrove fringes, canals", "Piscivore - nocturnal hunter of fish and frogs"),
    "Little Cormorant": ("Microcarbo niger", "Phalacrocoracidae", "Least Concern (LC)", "Freshwater lakes, city ponds, marshes, reservoirs", "Piscivore - small fish caught during underwater pursuit"),
    "Indian Cormorant": ("Phalacrocorax fuscicollis", "Phalacrocoracidae", "Least Concern (LC)", "Large open rivers, deep lakes, coastal bays", "Piscivore - schooling freshwater fish"),
    "Great Cormorant": ("Phalacrocorax carbo", "Phalacrocoracidae", "Least Concern (LC)", "Large estuaries, reservoirs, broad rivers", "Piscivore - medium to large fish caught diving deep"),
    "Oriental Darter": ("Anhinga melanogaster", "Anhingidae", "Near Threatened (NT)", "Freshwater lakes, slow river channels, marshes", "Piscivore - fish impaled underwater with dagger-like bill"),
    "Spot-billed Pelican": ("Pelecanus philippensis", "Pelecanidae", "Near Threatened (NT)", "Large inland lakes, coastal lagoons, marsh reserves", "Piscivore - schools of fish scooped in pouch")
}

def enrich():
    with open(BIRD_DB_PATH, 'r', encoding='utf-8') as f:
        birds = json.load(f)

    for bird in birds:
        s_id = bird['species_id']
        name = bird['common_name']

        if s_id in ENRICHMENT:
            bird.update(ENRICHMENT[s_id])
        elif name in LOOKUP:
            sci, fam, status, hab, diet = LOOKUP[name]
            bird['scientific_name'] = sci
            bird['family'] = fam
            bird['conservation_status'] = status
            bird['habitat'] = hab
            bird['diet'] = diet
            if 'physical_characteristics' not in bird:
                bird['physical_characteristics'] = f"Distinctive morphological characteristics of the {fam} family."
            if 'geographical_distribution' not in bird:
                bird['geographical_distribution'] = "Broadly distributed across favorable habitats in India."
            # Fallback image URL
            bird['image_url'] = f"https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80"
        else:
            bird['conservation_status'] = bird.get('conservation_status', 'Least Concern (LC)')
            bird['family'] = bird.get('family', 'Aves')
            bird['physical_characteristics'] = bird.get('physical_characteristics', 'Characteristic avian features suited for its niche.')
            bird['geographical_distribution'] = bird.get('geographical_distribution', 'Found across the Indian subcontinent.')
            bird['image_url'] = "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80"

    with open(BIRD_DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(birds, f, indent=4)

    print(f"Enriched {len(birds)} bird species successfully!")

if __name__ == '__main__':
    enrich()
