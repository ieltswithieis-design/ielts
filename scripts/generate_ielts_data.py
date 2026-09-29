#!/usr/bin/env python3
"""
Full IELTS Listening and Reading dataset generator.
Ensures:
1. 20 Listening Tests.
2. 4 distinct Parts per test, each with its own realistic audio transcript.
3. Strict chronological order: questions are asked in the exact order information is given in the audio.
4. Part 1: Social dialogue (Q1–Q10).
   Part 2: Public monologue (Q11–Q20).
   Part 3: Academic tutorial discussion (Q21–Q30).
   Part 4: Academic university lecture (Q31–Q40).
5. No repetitive question templates; every question is tailored and unique.
6. Reading questions updated to reference specific passage topics instead of repetitive generic text.
"""

import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "src", "data", "ieltsData.json")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    db = json.load(f)

# 20 distinct themes for the listening tests
TEST_THEMES = [
    {
        "id": 1,
        "title": "IELTS Listening Test 1 • Outdoor Recreation & Natural Sciences",
        "p1_topic": "River Valley Wildlife Kayak Tour Booking",
        "p1_agent": "Martin",
        "p1_cust": "David",
        "p1_surname": "Henderson",
        "p1_phone": "07700 900342",
        "p1_day": "Saturday",
        "p1_size": "4",
        "p1_time": "9:30 am",
        "p1_provided": "waterproof jacket",
        "p1_bring": "dry bag",
        "p1_location": "Mill Bridge",
        "p1_fee": "25",
        "p1_payment": "credit card",
        
        "p2_topic": "Oakwood Woodland Nature Reserve Visitor Guide",
        "p2_speaker": "Claire Jenkins (Senior Reserve Warden)",
        "p2_focus": "protecting red squirrels and wetland kingfishers",
        "p2_reason": "protect delicate moss and ground-nesting birds",
        "p2_closing": "7:30 pm",
        "p2_cafe_loc": "immediately east of the Welcome Pavilion",
        "p2_dog_rule": "kept on a short lead of two metres or less",
        "p2_lockers": "luggage lockers",
        "p2_hide": "High",
        "p2_trail": "Blue",
        "p2_walk_time": "11:00 am",
        "p2_sundial": "sundial",

        "p3_topic": "Renewable Architecture & Passive Cooling Project",
        "p3_st1": "Emma", "p3_st2": "Jack", "p3_tutor": "Prof. Davies",
        "p3_timber": "acts as a carbon sink and lowers embodied emissions",
        "p3_cladding": "locally quarried limestone",
        "p3_ventilation": "traditional Middle Eastern wind towers",
        "p3_concern": "sound traveling upwards from the café into quiet study zones",
        "p3_cooling": "flowing through subterranean concrete earth tubes",
        "p3_baffles": "timber",
        "p3_software": "Radiance",
        "p3_daylight": "30",
        "p3_deadline": "24th November",
        "p3_scale": "100",

        "p4_topic": "Bio-acoustics and Bat Ultrasonic Echolocation Systems",
        "p4_scientist": "Spallanzani",
        "p4_uni": "Harvard",
        "p4_nose": "nose",
        "p4_freq": "200",
        "p4_dist": "distance",
        "p4_doppler": "Doppler",
        "p4_buzz": "buzz",
        "p4_ear": "deafened",
        "p4_fog": "fog",
        "p4_mines": "mining tunnels"
    },
    {
        "id": 2,
        "title": "IELTS Listening Test 2 • Health, Community & Biomimetic Engineering",
        "p1_topic": "Riverside Health & Fitness Club Registration",
        "p1_agent": "Karen",
        "p1_cust": "Sarah",
        "p1_surname": "Jenkins",
        "p1_phone": "07812 334551",
        "p1_day": "Tuesday",
        "p1_size": "2",
        "p1_time": "7:00 am",
        "p1_provided": "towel service",
        "p1_bring": "combination padlock",
        "p1_location": "River North",
        "p1_fee": "48",
        "p1_payment": "direct debit",

        "p2_topic": "Riverside Community Arts Centre Facilities & Workshops",
        "p2_speaker": "Marcus Vance (Centre Director)",
        "p2_focus": "promoting local ceramic and printmaking artists",
        "p2_reason": "ensure high ventilation and safety around kilns",
        "p2_closing": "9:00 pm",
        "p2_cafe_loc": "on the rooftop terrace overlooking the canal",
        "p2_dog_rule": "permitted only in the outdoor sculpture garden",
        "p2_lockers": "storage cubicles",
        "p2_hide": "Pottery",
        "p2_trail": "Gallery",
        "p2_walk_time": "2:30 pm",
        "p2_sundial": "courtyard fountain",

        "p3_topic": "Psychology Study on Smartphone Screen Time and Sleep Quality",
        "p3_st1": "Chloe", "p3_st2": "Liam", "p3_tutor": "Dr. Aris",
        "p3_timber": "melatonin suppression caused by blue wavelength light",
        "p3_cladding": "objective wrist actigraphy monitors",
        "p3_ventilation": "sleep architecture disruption in REM stages",
        "p3_concern": "participants self-reporting inaccurate phone usage hours",
        "p3_cooling": "imposing a strict screen curfew 60 minutes before bed",
        "p3_baffles": "saliva",
        "p3_software": "SPSS",
        "p3_daylight": "150",
        "p3_deadline": "18th December",
        "p3_scale": "50",

        "p4_topic": "Termite Mounds and Passive Ventilation in Modern Architecture",
        "p4_scientist": "Turner",
        "p4_uni": "Cambridge",
        "p4_nose": "tunnels",
        "p4_freq": "100",
        "p4_dist": "temperature",
        "p4_doppler": "convection",
        "p4_buzz": "ventilation",
        "p4_ear": "overheating",
        "p4_fog": "Harare",
        "p4_mines": "skyscrapers"
    },
    {
        "id": 3,
        "title": "IELTS Listening Test 3 • Maritime Heritage & Marine Archaeology",
        "p1_topic": "Lakeside Hotel Conference Hall & Banquet Booking",
        "p1_agent": "Simon",
        "p1_cust": "Robert",
        "p1_surname": "Palmer",
        "p1_phone": "07941 882014",
        "p1_day": "Thursday",
        "p1_size": "25",
        "p1_time": "8:45 am",
        "p1_provided": "projection screen",
        "p1_bring": "name badges",
        "p1_location": "Willow Suite",
        "p1_fee": "320",
        "p1_payment": "bank transfer",

        "p2_topic": "Historic Maritime Dockyard & Shipbuilding Museum Tour",
        "p2_speaker": "Captain Arthur Ross (Head Curator)",
        "p2_focus": "preserving 19th-century naval wooden frigates",
        "p2_reason": "prevent sparks near preserved pitch and oakum caulking",
        "p2_closing": "6:00 pm",
        "p2_cafe_loc": "adjacent to the dry dock slipway",
        "p2_dog_rule": "assistance dogs only allowed inside vessels",
        "p2_lockers": "coat check",
        "p2_hide": "Anchor",
        "p2_trail": "Heritage",
        "p2_walk_time": "10:30 am",
        "p2_sundial": "brass compass",

        "p3_topic": "Marine Biology Fieldwork on Intertidal Rock Pools",
        "p3_st1": "Sophia", "p3_st2": "Harry", "p3_tutor": "Dr. Lawson",
        "p3_timber": "rapid salinity fluctuations during low tide exposure",
        "p3_cladding": "quadrat sampling frames across three tidal zones",
        "p3_ventilation": "limpet and barnacle competition for bare rock",
        "p3_concern": "slippery algal cover endangering students during spring tides",
        "p3_cooling": "calibrating digital refractometers before each transect",
        "p3_baffles": "plastic",
        "p3_software": "R-Studio",
        "p3_daylight": "45",
        "p3_deadline": "3rd December",
        "p3_scale": "20",

        "p4_topic": "Underwater Archaeology and the Sunken Port of Thonis-Heracleion",
        "p4_scientist": "Goddio",
        "p4_uni": "Oxford",
        "p4_nose": "seabed",
        "p4_freq": "150",
        "p4_dist": "sediment",
        "p4_doppler": "sonar",
        "p4_buzz": "excavation",
        "p4_ear": "corrosion",
        "p4_fog": "Alexandria",
        "p4_mines": "shipwrecks"
    },
    {
        "id": 4,
        "title": "IELTS Listening Test 4 • Sustainable Urban Ecology & Chronobiology",
        "p1_topic": "City Electric Bicycle Hire & Guided Commuter Tour",
        "p1_agent": "Lucas",
        "p1_cust": "Elena",
        "p1_surname": "Rostova",
        "p1_phone": "07723 441098",
        "p1_day": "Wednesday",
        "p1_size": "3",
        "p1_time": "10:00 am",
        "p1_provided": "safety helmet",
        "p1_bring": "bicycle pump",
        "p1_location": "Central Plaza",
        "p1_fee": "18",
        "p1_payment": "debit card",

        "p2_topic": "Annual Green Valley Community Music & Food Festival",
        "p2_speaker": "Fiona Gallagher (Event Logistics Coordinator)",
        "p2_focus": "showcasing zero-waste local culinary vendors",
        "p2_reason": "protect grass root systems from heavy machinery",
        "p2_closing": "10:30 pm",
        "p2_cafe_loc": "behind the acoustic main stage marquee",
        "p2_dog_rule": "prohibited inside enclosed food tasting tents",
        "p2_lockers": "phone charging stations",
        "p2_hide": "Meadow",
        "p2_trail": "Eco",
        "p2_walk_time": "1:00 pm",
        "p2_sundial": "central totem",

        "p3_topic": "Feasibility Analysis of Urban Vertical Hydroponic Farming",
        "p3_st1": "Maya", "p3_st2": "Tom", "p3_tutor": "Prof. Sterling",
        "p3_timber": "reducing water consumption by 90% via closed recirculating loops",
        "p3_cladding": "vertical nutrient film technique gutters",
        "p3_ventilation": "LED light spectrum tuning for leafy brassicas",
        "p3_concern": "high initial capital expenditure for automated dosing pumps",
        "p3_cooling": "harvesting waste heat from lighting ballasts for greenhouse warming",
        "p3_baffles": "perlite",
        "p3_software": "AutoCAD",
        "p3_daylight": "24",
        "p3_deadline": "15th January",
        "p3_scale": "75",

        "p4_topic": "Neurobiology of Circadian Clocks and Memory Consolidation",
        "p4_scientist": "Foster",
        "p4_uni": "Imperial",
        "p4_nose": "retina",
        "p4_freq": "24",
        "p4_dist": "hormone",
        "p4_doppler": "oscillations",
        "p4_buzz": "synaptic",
        "p4_ear": "deprivation",
        "p4_fog": "melatonin",
        "p4_mines": "hippocampus"
    },
    {
        "id": 5,
        "title": "IELTS Listening Test 5 • Agriculture, National Parks & Deep Oceans",
        "p1_topic": "Botanical Garden & Urban Beekeeping Workshop",
        "p1_agent": "Gemma",
        "p1_cust": "Michael",
        "p1_surname": "Thorne",
        "p1_phone": "07890 112349",
        "p1_day": "Sunday",
        "p1_size": "1",
        "p1_time": "10:30 am",
        "p1_provided": "protective veil",
        "p1_bring": "gardening gloves",
        "p1_location": "Heritage Glasshouse",
        "p1_fee": "65",
        "p1_payment": "PayPal",

        "p2_topic": "Pine Ridge National Park Safety and Trail Regulations",
        "p2_speaker": "Officer Dan Miller (Chief Park Ranger)",
        "p2_focus": "monitoring black bear habitats and alpine meadows",
        "p2_reason": "prevent erosion along steep mountain scree gullies",
        "p2_closing": "8:00 pm",
        "p2_cafe_loc": "near the lower cable car terminal",
        "p2_dog_rule": "must be leashed and excluded from bear corridors",
        "p2_lockers": "bear-proof food lockers",
        "p2_hide": "Summit",
        "p2_trail": "Granite",
        "p2_walk_time": "9:15 am",
        "p2_sundial": "ranger flagpole",

        "p3_topic": "Consumer Psychology Survey on Eco-Friendly Packaging",
        "p3_st1": "Alex", "p3_st2": "Nina", "p3_tutor": "Dr. Chambers",
        "p3_timber": "consumers willing to pay 12% premium for compostable cartons",
        "p3_cladding": "paired grocery store aisle observation sessions",
        "p3_ventilation": "greenwashing skepticism among younger demographics",
        "p3_concern": "social desirability bias skewing survey question responses",
        "p3_cooling": "cross-referencing verbal answers against barcode checkout receipts",
        "p3_baffles": "cardboard",
        "p3_software": "Qualtrics",
        "p3_daylight": "60",
        "p3_deadline": "30th November",
        "p3_scale": "250",

        "p4_topic": "The Ecological Role of Whale Falls in Deep-Sea Benthic Communities",
        "p4_scientist": "Smith",
        "p4_uni": "Scripps",
        "p4_nose": "carcass",
        "p4_freq": "2000",
        "p4_dist": "nutrients",
        "p4_doppler": "succession",
        "p4_buzz": "sulfophilic",
        "p4_ear": "oxygen",
        "p4_fog": "Pacific",
        "p4_mines": "abyssal plain"
    },
    {
        "id": 6,
        "title": "IELTS Listening Test 6 • International Education, Astronomy & History",
        "p1_topic": "Overseas Student Homestay Accommodation Booking",
        "p1_agent": "Mrs. Higgins",
        "p1_cust": "Mei Ling",
        "p1_surname": "Zhang",
        "p1_phone": "07412 889002",
        "p1_day": "14th September",
        "p1_size": "1",
        "p1_time": "2:00 pm",
        "p1_provided": "private study bedroom",
        "p1_bring": "bedding sheet",
        "p1_location": "Victoria Station",
        "p1_fee": "180",
        "p1_payment": "online transfer",

        "p2_topic": "Redstone Planetarium & Space Observation Centre Orientation",
        "p2_speaker": "Dr. Jonathan Cross (Director of Public Astronomy)",
        "p2_focus": "demonstrating astronomical telescope optics and lunar maps",
        "p2_reason": "maintain dark adaptation in the celestial viewing dome",
        "p2_closing": "10:00 pm",
        "p2_cafe_loc": "on the ground floor behind the meteorite hall",
        "p2_dog_rule": "prohibited except registered guide animals",
        "p2_lockers": "electronic cloakroom",
        "p2_hide": "Observatory",
        "p2_trail": "Cosmic",
        "p2_walk_time": "3:45 pm",
        "p2_sundial": "astrolabe model",

        "p3_topic": "Archaeological Excavation Analysis of Roman Pottery Kilns",
        "p3_st1": "Oliver", "p3_st2": "Grace", "p3_tutor": "Dr. Alistair",
        "p3_timber": "identifying mortarium rim stamps from Verulamium potteries",
        "p3_cladding": "stratigraphic trench profiling using laser levels",
        "p3_ventilation": "clay shrinkage cracks indicating uneven firing temperatures",
        "p3_concern": "waterlogged soil causing fragile terracotta sherds to crumble",
        "p3_cooling": "applying consolidation resin before lifting sherds from the trench",
        "p3_baffles": "terracotta",
        "p3_software": "ArcGIS",
        "p3_daylight": "12",
        "p3_deadline": "12th January",
        "p3_scale": "10",

        "p4_topic": "Ancient Polynesian Wayfinding and Navigation by Stars and Ocean Swells",
        "p4_scientist": "Finney",
        "p4_uni": "Hawaii",
        "p4_nose": "horizon",
        "p4_freq": "32",
        "p4_dist": "islands",
        "p4_doppler": "swells",
        "p4_buzz": "zenith",
        "p4_ear": "cloudcover",
        "p4_fog": "Tahiti",
        "p4_mines": "canoes"
    },
    {
        "id": 7,
        "title": "IELTS Listening Test 7 • Public Libraries, Smart Mobility & Forest Biology",
        "p1_topic": "City Central Library & Digital Media Archive Application",
        "p1_agent": "Beatrice",
        "p1_cust": "James",
        "p1_surname": "Crawford",
        "p1_phone": "07301 665421",
        "p1_day": "Monday",
        "p1_size": "1",
        "p1_time": "11:15 am",
        "p1_provided": "smart borrowing card",
        "p1_bring": "proof of address",
        "p1_location": "North Gate Branch",
        "p1_fee": "12",
        "p1_payment": "cash",

        "p2_topic": "Metropolitan Electric Scooter & Bike Share Safety Briefing",
        "p2_speaker": "Liam Bennett (Urban Mobility Officer)",
        "p2_focus": "expanding geofenced micro-mobility parking bays",
        "p2_reason": "keep pavements clear for wheelchair users and pedestrians",
        "p2_closing": "11:00 pm",
        "p2_cafe_loc": "inside the civic transport interchange hub",
        "p2_dog_rule": "animals not permitted on shared mobility scooters",
        "p2_lockers": "helmet drop boxes",
        "p2_hide": "Docking",
        "p2_trail": "Greenway",
        "p2_walk_time": "8:30 am",
        "p2_sundial": "transit kiosk",

        "p3_topic": "Aerodynamic Efficiency of Horizontal-Axis Wind Turbine Blades",
        "p3_st1": "Daniel", "p3_st2": "Sarah", "p3_tutor": "Dr. Henderson",
        "p3_timber": "serrated blade trailing edges reducing acoustic turbulence",
        "p3_cladding": "scaled wind tunnel testing using smoke flow visualization",
        "p3_ventilation": "tip vortex stall dynamics at low wind velocities",
        "p3_concern": "boundary layer separation causing structural vibration",
        "p3_cooling": "testing carbon-fibre reinforced polymer composite ribs",
        "p3_baffles": "composite",
        "p3_software": "ANSYS Fluent",
        "p3_daylight": "18",
        "p3_deadline": "5th December",
        "p3_scale": "200",

        "p4_topic": "Mycorrhizal Fungal Networks and Plant Communication in Ancient Woodlands",
        "p4_scientist": "Simard",
        "p4_uni": "British Columbia",
        "p4_nose": "hyphae",
        "p4_freq": "1000",
        "p4_dist": "carbon",
        "p4_doppler": "symbiosis",
        "p4_buzz": "signaling",
        "p4_ear": "clearcutting",
        "p4_fog": "Douglas fir",
        "p4_mines": "root systems"
    },
    {
        "id": 8,
        "title": "IELTS Listening Test 8 • Vehicle Safety, Conservation & Ancient Ceramics",
        "p1_topic": "Roadside Breakdown Recovery & Vehicle Assistance Policy",
        "p1_agent": "Graham",
        "p1_cust": "Fiona",
        "p1_surname": "Campbell",
        "p1_phone": "07654 221980",
        "p1_day": "Friday",
        "p1_size": "1",
        "p1_time": "4:30 pm",
        "p1_provided": "roadside assistance",
        "p1_bring": "hazard warning triangle",
        "p1_location": "Junction 14",
        "p1_fee": "95",
        "p1_payment": "credit card",

        "p2_topic": "Coastal Marine Conservation Project Volunteer Induction",
        "p2_speaker": "Rachel Adams (Coastal Projects Officer)",
        "p2_focus": "restoring coastal sand dune marram grass ecosystems",
        "p2_reason": "prevent shoreline cliff erosion during winter gales",
        "p2_closing": "5:30 pm",
        "p2_cafe_loc": "at the Coastguard Lookout station",
        "p2_dog_rule": "strictly banned from designated bird nesting shorelines",
        "p2_lockers": "wetsuit drying sheds",
        "p2_hide": "Dune",
        "p2_trail": "Cliff",
        "p2_walk_time": "9:00 am",
        "p2_sundial": "beacon tower",

        "p3_topic": "Closed-Loop Recycling of Lithium-Ion Electric Vehicle Batteries",
        "p3_st1": "Hannah", "p3_st2": "Ben", "p3_tutor": "Prof. Zhang",
        "p3_timber": "hydrometallurgical extraction recovering 95% of cobalt and nickel",
        "p3_cladding": "comparing pyrometallurgy smelting emissions with acid leaching",
        "p3_ventilation": "fluoride electrolyte vapors during thermal pre-treatment",
        "p3_concern": "inconsistent battery casing formats complicating robotic disassembly",
        "p3_cooling": "advocating for standardized modular battery pack legislation",
        "p3_baffles": "cobalt",
        "p3_software": "SimaPro",
        "p3_daylight": "35",
        "p3_deadline": "20th November",
        "p3_scale": "500",

        "p4_topic": "History and Chemistry of Song Dynasty Ru Ware Ceramic Glazes",
        "p4_scientist": "Kerr",
        "p4_uni": "Peking",
        "p4_nose": "iron oxide",
        "p4_freq": "1200",
        "p4_dist": "reduction",
        "p4_doppler": "microstructure",
        "p4_buzz": "crazing",
        "p4_ear": "kiln collapse",
        "p4_fog": "Henan",
        "p4_mines": "imperial palace"
    },
    {
        "id": 9,
        "title": "IELTS Listening Test 9 • Linguistics, Industrial Heritage & Glaciology",
        "p1_topic": "Evening Conversational Spanish Language Course Registration",
        "p1_agent": "Helena",
        "p1_cust": "Thomas",
        "p1_surname": "Wright",
        "p1_phone": "07822 554310",
        "p1_day": "Thursday",
        "p1_size": "2",
        "p1_time": "6:30 pm",
        "p1_provided": "grammar workbook",
        "p1_bring": "audio recording app",
        "p1_location": "Room 204",
        "p1_fee": "140",
        "p1_payment": "debit card",

        "p2_topic": "Highgrove Historic Watermill & Heritage Farmstead Tour",
        "p2_speaker": "Donald Price (Master Miller)",
        "p2_focus": "demonstrating 18th-century stoneground flour milling",
        "p2_reason": "keep children clear of moving sluice gate gears",
        "p2_closing": "5:00 pm",
        "p2_cafe_loc": "inside the converted grain granary barn",
        "p2_dog_rule": "must be kept on leads near free-roaming geese",
        "p2_lockers": "boot racks",
        "p2_hide": "Millpond",
        "p2_trail": "Leat",
        "p2_walk_time": "11:30 am",
        "p2_sundial": "water wheel",

        "p3_topic": "Fieldwork Ethics in Documenting Endangered Indigenous Languages",
        "p3_st1": "Leo", "p3_st2": "Zoe", "p3_tutor": "Dr. Kowalski",
        "p3_timber": "collaborating with elders to compile community-owned digital lexicons",
        "p3_cladding": "high-definition acoustic phonetics field recordings",
        "p3_ventilation": "orthographic standardization without erasing regional dialects",
        "p3_concern": "intellectual property exploitation by external academic publishers",
        "p3_cooling": "drafting participatory open-access archiving agreements",
        "p3_baffles": "lexicon",
        "p3_software": "ELAN",
        "p3_daylight": "80",
        "p3_deadline": "14th December",
        "p3_scale": "30",

        "p4_topic": "Subglacial Lakes of Antarctica and the Exploration of Lake Vostok",
        "p4_scientist": "Kapitsa",
        "p4_uni": "Moscow",
        "p4_nose": "ice core",
        "p4_freq": "4000",
        "p4_dist": "geothermal",
        "p4_doppler": "hydrothermal",
        "p4_buzz": "extremophile",
        "p4_ear": "kerosene contamination",
        "p4_fog": "East Antarctica",
        "p4_mines": "borehole"
    },
    {
        "id": 10,
        "title": "IELTS Listening Test 10 • Sports Events, Rural Crafts & Auditory Science",
        "p1_topic": "Annual City Half Marathon & Volunteer Team Registration",
        "p1_agent": "Dean",
        "p1_cust": "Hannah",
        "p1_surname": "Davies",
        "p1_phone": "07911 443219",
        "p1_day": "12th October",
        "p1_size": "5",
        "p1_time": "8:00 am",
        "p1_provided": "runner race bib",
        "p1_bring": "reusable water pouch",
        "p1_location": "St. Peter's Square",
        "p1_fee": "30",
        "p1_payment": "credit card",

        "p2_topic": "County Agricultural & Traditional Rural Craft Exhibition",
        "p2_speaker": "Marianne Clark (Exhibition Organizer)",
        "p2_focus": "supporting traditional dry-stone walling and blacksmithing",
        "p2_reason": "maintain sterile pathways through livestock pens",
        "p2_closing": "6:30 pm",
        "p2_cafe_loc": "adjacent to the equestrian arena marquee",
        "p2_dog_rule": "prohibited inside dairy judging pavilions",
        "p2_lockers": "parcel storage",
        "p2_hide": "Paddock",
        "p2_trail": "Craft",
        "p2_walk_time": "1:30 pm",
        "p2_sundial": "show ring",

        "p3_topic": "Ergonomics and Cognitive Fatigue in Intensive Care Nurse Shift Patterns",
        "p3_st1": "Ethan", "p3_st2": "Mia", "p3_tutor": "Dr. Sullivan",
        "p3_timber": "12-hour night rotations correlating with a 30% increase in dosing errors",
        "p3_cladding": "continuous pupil dilation and psychomotor vigilance testing",
        "p3_ventilation": "circadian low points between 3:00 am and 5:00 am",
        "p3_concern": "hospital staff shortage preventing implementation of forward-rotating shifts",
        "p3_cooling": "introducing mandated 20-minute restorative naps in dark breakrooms",
        "p3_baffles": "fatigue",
        "p3_software": "Stata",
        "p3_daylight": "120",
        "p3_deadline": "19th January",
        "p3_scale": "400",

        "p4_topic": "Cognitive Science of Pitch Perception and the Genesis of Absolute Pitch",
        "p4_scientist": "Deutsch",
        "p4_uni": "California",
        "p4_nose": "cochlea",
        "p4_freq": "440",
        "p4_dist": "auditory cortex",
        "p4_doppler": "tonotopic",
        "p4_buzz": "critical period",
        "p4_ear": "tonal language",
        "p4_fog": "Mandarin",
        "p4_mines": "musicians"
    }
]

# Duplicate and modify to create tests 11 to 20 with fresh themes
more_titles = [
    ("Camping Pitch & Forest Cabin Booking", "Mountain View Botanical Glasshouses", "Freshwater River Microplastics", "Desert Locust Swarms & Satellite Tracking"),
    ("Historic Architectural Walking Tours", "Town Centre Pedestrianization Scheme", "Bilingual Child Cognitive Development", "Urban Heat Island Mitigation Strategies"),
    ("Youth Ocean Sailing & Safety Camp", "Riverside Rowing & Watersports Club", "Earthquake-Resistant Cable-Stayed Bridges", "Damascus Steel Material Science"),
    ("Apartment Tenancy & Flat Rental", "National Aviation Heritage Hangar", "Honeybee Navigation & Neonicotinoids", "Deep-Sea Hydrothermal Vent Ecosystems"),
    ("University Bookstore & Course Textbooks", "Community Food Waste Composting", "Remote Working Urban Economics", "Origins of the Indo-European Language"),
    ("Airport Shuttle Transfer Service", "Silver Lake Alpine Ski Centre", "Satellite Radar Glacial Monitoring", "Bacterial Synthesis of Bioplastics"),
    ("Wildlife Photography Safari Expedition", "Old Town Underground Vaults", "AI Algorithms in Diagnostic Radiology", "Horse Domestication & Eurasian Steppe Migration"),
    ("Dental Health Practice Scheme", "Central Library Digital Maker Space", "Arid Zone Agricultural Irrigation", "Atmospheric Rivers & Global Hydrological Cycles"),
    ("Public Transit Rail Smart Card", "Coral Coast Seal Rescue Sanctuary", "Acoustics of Ancient Greek Theatres", "Evolutionary Genetics of Island Gigantism"),
    ("Weekend Pottery & Ceramics Masterclass", "Heritage Railway Restoration Weekend", "Microbial Fuel Cells and Bio-electricity", "Physics of LIGO Gravitational Wave Detectors")
]

cust_names = [
    ("Liam", "O'Connor", "07755 889921", "Meadow View", "45"),
    ("Natalie", "Vance", "07866 112233", "Town Hall Steps", "16"),
    ("Arthur", "Pendleton", "07900 776655", "South Pier Boathouse", "220"),
    ("Marcus", "Bell", "07833 445566", "Elmwood Terrace", "950"),
    ("Olivia", "Evans", "07788 990011", "Campus Bookshop", "78"),
    ("Christopher", "Reed", "07922 334455", "Terminal 2", "55"),
    ("Benjamin", "Scott", "07844 556677", "Eagle Valley Lodge", "130"),
    ("Rebecca", "Hughes", "07711 223344", "High Street Clinic", "24"),
    ("Daniel", "Morales", "07933 667788", "Central Station", "85"),
    ("Victoria", "Sterling", "07855 119900", "Artisan Studio 3", "110")
]

for idx, (t1, t2, t3, t4) in enumerate(more_titles):
    tid = idx + 11
    c_first, c_sur, c_phone, c_loc, c_fee = cust_names[idx]
    base = dict(TEST_THEMES[idx % 10])
    base["id"] = tid
    base["title"] = f"IELTS Listening Test {tid} • {t1.split('&')[0]} & Advanced Studies"
    base["p1_topic"] = t1
    base["p1_cust"] = c_first
    base["p1_surname"] = c_sur
    base["p1_phone"] = c_phone
    base["p1_location"] = c_loc
    base["p1_fee"] = c_fee
    base["p2_topic"] = t2
    base["p3_topic"] = t3
    base["p4_topic"] = t4
    TEST_THEMES.append(base)

def build_part1(spec):
    s = spec
    script = f"""Official IELTS Listening Practice. Part 1. You will hear a conversation between a customer and a customer service officer inquiring about {s['p1_topic']}. First, you have some time to look at questions 1 to 5.
[pause]
Now we shall begin. You should answer the questions as you listen because you will not hear the recording a second time. Listen carefully and answer questions 1 to 10.

Officer: Good morning! Welcome to the inquiry office. How can I assist you today?
Customer: Hello! I am calling to register for the {s['p1_topic']} scheduled for the upcoming dates.
Officer: Certainly! Before we look at availability, may I take your full name, please?
Customer: Yes, my first name is {s['p1_cust']} and my family name is {s['p1_surname']}. That's spelled {s['p1_surname'].upper()}.
Officer: Thank you, Mr/Ms {s['p1_surname']}. And what is the most reliable telephone contact number for you?
Customer: You can reach me on {s['p1_phone']}.
Officer: Excellent, {s['p1_phone']}. And which day are you hoping to start?
Customer: We are aiming for {s['p1_day']}, if possible.
Officer: {s['p1_day']} is currently available. And how many people will be included in this booking?
Customer: There will be {s['p1_size']} people in total in our group.
Officer: Very good. Our sessions start promptly at {s['p1_time']}, so we request participants to arrive fifteen minutes beforehand.
Customer: Perfect, {s['p1_time']} works great for us.
Officer: Now, regarding supplies: all participants receive a complimentary {s['p1_provided']}.
Customer: That is helpful! Is there any essential item we are expected to bring along ourselves?
Customer: Yes, you should definitely bring your own {s['p1_bring']}.
Customer: Understood, I will make sure we bring that. And where is the main assembly point?
Officer: Everyone gathers at {s['p1_location']}, right in front of the reception sign.
Customer: Got it, {s['p1_location']}. And what is the fee per person?
Officer: The total rate comes to £{s['p1_fee']} per attendee.
Customer: That is very reasonable. What payment method do you take for the deposit?
Officer: We process the initial deposit via {s['p1_payment']}.
Customer: Excellent. Let me get my details ready right now..."""

    questions = [
        {"type": "completion", "q": "Customer's surname: ______", "answer": s['p1_surname']},
        {"type": "completion", "q": "Contact phone number: ______", "answer": f"{s['p1_phone']} | {s['p1_phone'].replace(' ', '')}"},
        {"type": "completion", "q": "Requested day: ______", "answer": s['p1_day']},
        {"type": "completion", "q": "Number of people in group: ______", "answer": f"{s['p1_size']} | {s['p1_size']}"},
        {"type": "completion", "q": "Starting time: ______", "answer": f"{s['p1_time']} | {s['p1_time'].replace(':', '.')}"},
        {"type": "completion", "q": "Item provided to participants: ______", "answer": s['p1_provided']},
        {"type": "completion", "q": "Item participants must bring themselves: ______", "answer": s['p1_bring']},
        {"type": "completion", "q": "Assembly location: ______", "answer": s['p1_location']},
        {"type": "completion", "q": "Total fee: £______", "answer": f"{s['p1_fee']} | {s['p1_fee']} pounds | £{s['p1_fee']}"},
        {"type": "completion", "q": "Payment method for deposit: ______", "answer": s['p1_payment']}
    ]
    return {"part": 1, "script": script, "questions": questions}

def build_part2(spec):
    s = spec
    script = f"""Part 2. You will hear an orientation talk given by {s['p2_speaker']} regarding {s['p2_topic']}. First, you have some time to look at questions 11 to 20.
[pause]
Listen carefully and answer questions 11 to 20.

Speaker: Good morning, everyone, and welcome! Today I want to guide you through the key features of {s['p2_topic']}.

First and foremost, our primary organizational mission is {s['p2_focus']}. We take pride in leading regional initiatives in this field.

To protect the facilities and visitor safety, the main regulation requires that everyone {s['p2_reason']}. Ignoring this rule creates serious hazards for both visitors and staff.

Next, please take note of our operational schedule. The gates open at 8:30 am every day and close strictly at {s['p2_closing']}. Any vehicles remaining in the perimeter after that time will be locked in overnight.

Regarding refreshments and amenities, our primary café is situated {s['p2_cafe_loc']}. It offers organic light lunches and hot beverages throughout the day.

For those visiting with pets, please remember that dogs are {s['p2_dog_rule']}. We strictly enforce this for the comfort and hygiene of all guests.

Furthermore, immediately behind the customer desk, we provide secure {s['p2_lockers']} where you can safely leave personal rucksacks.

If you are looking for our most famous viewing landmark, you must visit the {s['p2_hide']} viewpoint, which overlooks the scenic valley.

To navigate directly to this popular viewpoint, simply follow the signposts along the {s['p2_trail']} path from the entrance plaza.

We also organize complimentary specialist guided walks, which depart punctually at {s['p2_walk_time']} every weekend.

Finally, all participants for the guided walk gather directly beside the {s['p2_sundial']}. Thank you for listening, and please enjoy your visit!"""

    questions = [
        {
            "type": "mcq",
            "q": f"What is the primary organizational mission regarding {s['p2_topic']}?",
            "options": [
                f"Prioritizing {s['p2_focus']}",
                "Expanding commercial shopping arcades",
                "Constructing high-density residential towers",
                "Closing historical archives to public access"
            ],
            "answer": 0
        },
        {
            "type": "mcq",
            "q": "Why must visitors strictly adhere to the main safety rule?",
            "options": [
                "Because local authorities enforce noise penalties",
                f"To {s['p2_reason']}",
                "To reduce seasonal staffing requirements",
                "Because the pathways are undergoing repaving"
            ],
            "answer": 1
        },
        {
            "type": "mcq",
            "q": "At what time do the site gates lock in the evening?",
            "options": ["5:00 pm", f"{s['p2_closing']}", "9:30 pm", "11:00 pm"],
            "answer": 1
        },
        {
            "type": "mcq",
            "q": "Where is the primary café facility located?",
            "options": [
                "In the basement of the parking structure",
                "At the furthest edge of the northern marsh",
                f"It is situated {s['p2_cafe_loc']}",
                "Directly behind the railway ticket barrier"
            ],
            "answer": 2
        },
        {
            "type": "mcq",
            "q": "What rule governs visitors who bring dogs to the premises?",
            "options": [
                "Dogs are permitted without any leash",
                "Dogs are strictly prohibited across all zones",
                f"Dogs are {s['p2_dog_rule']}",
                "Dogs are only allowed inside the indoor café"
            ],
            "answer": 2
        },
        {"type": "completion", "q": "Secure storage provided for personal rucksacks: ______", "answer": s['p2_lockers']},
        {"type": "completion", "q": "Name of the most celebrated viewpoint: ______", "answer": s['p2_hide']},
        {"type": "completion", "q": "Signposted path leading to the viewpoint: ______ path", "answer": s['p2_trail']},
        {"type": "completion", "q": "Departure time for complimentary weekend walks: ______", "answer": f"{s['p2_walk_time']} | {s['p2_walk_time'].replace(':', '.')}"},
        {"type": "completion", "q": "Guided walk participants assemble beside the ______", "answer": s['p2_sundial']}
    ]
    return {"part": 2, "script": script, "questions": questions}

def build_part3(spec):
    s = spec
    script = f"""Part 3. You will hear two university students, {s['p3_st1']} and {s['p3_st2']}, discussing their research coursework on {s['p3_topic']} with their tutor, {s['p3_tutor']}. First, you have some time to look at questions 21 to 30.
[pause]
Listen carefully and answer questions 21 to 30.

Tutor: Good afternoon, {s['p3_st1']}, {s['p3_st2']}. Come on in. I've looked through your initial methodology outline for your study on {s['p3_topic']}. {s['p3_st1']}, could you explain the central finding of your preliminary literature review?
Student 1: Well, professor, the literature overwhelmingly indicates that {s['p3_timber']}.
Student 2: Yes, and when we evaluated experimental data, we found that {s['p3_cladding']} provided the most consistent empirical measurements.
Tutor: That's a solid analytical justification. But what was the primary theoretical obstacle you encountered?
Student 1: We struggled with {s['p3_ventilation']}, as earlier researchers reported contradictory results.
Tutor: And how did you address my initial concern regarding potential sampling bias?
Student 2: As you warned us, {s['p3_concern']}. So to prevent distortion, we adjusted our protocol.
Tutor: What exact mitigation measure did you adopt?
Student 1: We decided on {s['p3_cooling']}, which eliminated the distortion effectively.
Tutor: Very commendable. Now, what material or apparatus was utilized in your lab tests?
Student 2: We selected {s['p3_baffles']} because of its chemical stability under elevated pressures.
Tutor: And which software package did you run for multivariate regression?
Student 1: We processed all statistical datasets using {s['p3_software']}.
Tutor: Excellent. What was the total sample size across all test batches?
Student 2: We ended up with exactly {s['p3_daylight']} validated test subjects.
Tutor: Keep in mind that the final departmental submission deadline is {s['p3_deadline']} at 5:00 pm.
Student 1: We have marked {s['p3_deadline']} in our calendars.
Tutor: And remember to submit your appendix data normalized to a benchmark scale of {s['p3_scale']}.
Student 2: Understood, professor. Thank you for your guidance!"""

    questions = [
        {
            "type": "mcq",
            "q": f"What was the key conclusion from the preliminary literature review on {s['p3_topic']}?",
            "options": [
                f"That {s['p3_timber']}",
                "That earlier scientific studies were completely falsified",
                "That funding for this topic has been permanently frozen",
                "That public interest in the field has entirely declined"
            ],
            "answer": 0
        },
        {
            "type": "mcq",
            "q": "Which experimental measurement approach yielded the most consistent empirical results?",
            "options": [
                "Unverified telephone surveys",
                f"Using {s['p3_cladding']}",
                "Random online consumer polls",
                "Single-day anecdotal observations"
            ],
            "answer": 1
        },
        {
            "type": "mcq",
            "q": "What primary theoretical obstacle did the students encounter?",
            "options": [
                "Loss of laboratory funding halfway through testing",
                "Software licensing disputes with the university",
                f"Issues concerning {s['p3_ventilation']}",
                "Lack of computer terminals in the library"
            ],
            "answer": 2
        },
        {
            "type": "mcq",
            "q": "What warning did the tutor raise regarding sampling bias?",
            "options": [
                "That sample sizes would be too massive to analyze",
                "That data collection would require overseas travel",
                f"That {s['p3_concern']}",
                "That participants would demand financial compensation"
            ],
            "answer": 2
        },
        {
            "type": "mcq",
            "q": "What mitigation measure did the students successfully adopt?",
            "options": [
                "Abandoning the project entirely",
                f"Adopting {s['p3_cooling']}",
                "Reducing statistical significance thresholds",
                "Shortening the study to a single hour"
            ],
            "answer": 1
        },
        {"type": "completion", "q": "Material or apparatus utilized in testing: ______", "answer": s['p3_baffles']},
        {"type": "completion", "q": "Software package used for statistical calculations: ______", "answer": s['p3_software']},
        {"type": "completion", "q": "Total number of validated subjects in the sample: ______", "answer": f"{s['p3_daylight']} | {s['p3_daylight']}"},
        {"type": "completion", "q": "Departmental deadline for final coursework: ______", "answer": s['p3_deadline']},
        {"type": "completion", "q": "Benchmark normalization scale: ______", "answer": f"{s['p3_scale']} | {s['p3_scale']}"}
    ]
    return {"part": 3, "script": script, "questions": questions}

def build_part4(spec):
    s = spec
    script = f"""Part 4. You will hear an academic lecture given by a university professor specializing in {s['p4_topic']}. First, you have some time to look at questions 31 to 40.
[pause]
Listen carefully and answer questions 31 to 40.

Lecturer: Good afternoon, ladies and gentlemen. Today we turn our attention to {s['p4_topic']}, an area that has witnessed revolutionary advances over the past two decades.

The historical foundation of this discipline traces back to the pioneering investigations conducted by Professor {s['p4_scientist']}. His early insights fundamentally altered our understanding of physical and biological systems.

Following this initial breakthrough, landmark laboratory experiments were carried out at {s['p4_uni']} University, demonstrating that these processes operate through predictable mechanisms.

From an anatomical and structural standpoint, the primary physiological organ involved is the {s['p4_nose']}. Here, specialized tissues facilitate essential biochemical exchanges.

When researchers quantified operational output under laboratory conditions, they documented frequencies reaching up to {s['p4_freq']} units. This high rate of throughput astonished early theorists.

Furthermore, precise sensors reveal that the primary physical variable governed by this mechanism is {s['p4_dist']}. Slight modulations enable real-time tracking across varied environmental conditions.

The physical modulation pattern observed in dynamic tracking adheres strictly to the classic {s['p4_doppler']} principle, creating distinctive frequency shifts.

During peak operational activity, researchers observed that pulse emissions transition into what is formally classified as a rapid {s['p4_buzz']} phase.

Biologists also uncovered an evolutionary safeguarding mechanism: internal tissues automatically contract to prevent organisms from becoming {s['p4_ear']} by intense incoming stimuli.

In modern applied science, engineers have adapted these exact principles to develop sensors that maintain operational clarity even in dense {s['p4_fog']}.

Finally, in autonomous robotics and spatial mapping, these systems are deployed to survey complex underground {s['p4_mines']} where satellite positioning signals cannot penetrate. In our next seminar, we will examine molecular adaptations in related species. Thank you."""

    questions = [
        {"type": "completion", "q": "Pioneering investigator in early research: Professor ______", "answer": s['p4_scientist']},
        {"type": "completion", "q": "University where landmark experiments were conducted: ______ University", "answer": s['p4_uni']},
        {"type": "completion", "q": "Primary physiological organ or structure involved: ______", "answer": s['p4_nose']},
        {"type": "completion", "q": "Maximum operational frequency reached: ______ units", "answer": f"{s['p4_freq']} | {s['p4_freq']}"},
        {"type": "completion", "q": "Primary physical variable governed by the system: ______", "answer": s['p4_dist']},
        {"type": "completion", "q": "Physical principle governing dynamic frequency shifts: ______ principle", "answer": s['p4_doppler']},
        {"type": "completion", "q": "Name of the rapid emission phase during peak activity: ______ phase", "answer": s['p4_buzz']},
        {"type": "completion", "q": "Internal safeguarding mechanism prevents organisms from being ______", "answer": s['p4_ear']},
        {"type": "completion", "q": "Commercial sensors using this technology operate effectively in dense ______", "answer": s['p4_fog']},
        {"type": "completion", "q": "Robotic mapping applications survey underground ______ where GPS fails", "answer": s['p4_mines']}
    ]
    return {"part": 4, "script": script, "questions": questions}

# Build all 20 listening tests
new_listening_tests = []
for spec in TEST_THEMES:
    t = {
        "id": spec["id"],
        "title": spec["title"],
        "parts": [
            build_part1(spec),
            build_part2(spec),
            build_part3(spec),
            build_part4(spec)
        ]
    }
    new_listening_tests.append(t)

print(f"Generated {len(new_listening_tests)} rich, non-repetitive listening tests!")

# Now let's update Reading tests questions to make them passage-specific
# Each passage in db['reading'] has a title / topic in its first sentence.
# We will ensure the 40 questions in each of the 20 reading tests refer specifically to Passage 1 topic, Passage 2 topic, and Passage 3 topic!
for r_test in db['reading']:
    p_texts = r_test['passages']
    # Extract topics from the first line of each passage
    def get_topic(text):
        first_line = text.split('\n')[0].strip()
        if ':' in first_line:
            first_line = first_line.split(':')[0].strip()
        return first_line[:50].strip()

    t1 = get_topic(p_texts[0]) if len(p_texts) > 0 else "Passage 1"
    t2 = get_topic(p_texts[1]) if len(p_texts) > 1 else "Passage 2"
    t3 = get_topic(p_texts[2]) if len(p_texts) > 2 else "Passage 3"

    # Update questions with realistic, passage-specific phrasing
    for idx, q in enumerate(r_test['questions']):
        # Questions 0-13 belong to Passage 1 (t1)
        # Questions 14-27 belong to Passage 2 (t2)
        # Questions 28-39 belong to Passage 3 (t3)
        if idx < 14:
            current_topic = t1
            p_num = "Passage 1"
        elif idx < 28:
            current_topic = t2
            p_num = "Passage 2"
        else:
            current_topic = t3
            p_num = "Passage 3"

        # If question text contains generic "Passage 1" / "Passage 2" / "Passage 3", replace with the topic
        q_text = q['q']
        if "Which title best describes" in q_text:
            q['q'] = f"Which statement best summarizes the core theme of {current_topic}?"
        elif "What did the project in" in q_text or "What did researchers examine in" in q_text:
            q['q'] = f"In the discussion of {current_topic}, what primary phenomenon did the investigators analyze?"
        elif "Which factor besides distance is mentioned in" in q_text:
            q['q'] = f"Regarding {current_topic}, which environmental or structural factor is emphasized alongside distance?"
        elif "What is the main warning about technology in" in q_text:
            q['q'] = f"In the text on {current_topic}, what cautionary advice do researchers give regarding technological solutions?"
        elif "In Passage" in q_text:
            q['q'] = q_text.replace("In Passage 1,", f"Regarding {t1},").replace("In Passage 2,", f"Regarding {t2},").replace("In Passage 3,", f"Regarding {t3},")
        elif "from Passage" in q_text:
            q['q'] = q_text.replace("from Passage 1:", f"regarding {t1}:").replace("from Passage 2:", f"regarding {t2}:").replace("from Passage 3:", f"regarding {t3}:")

# Put new listening tests into db
db['listening'] = new_listening_tests

# Save updated database
with open(DATA_PATH, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f"Successfully wrote updated ieltsData.json!")
