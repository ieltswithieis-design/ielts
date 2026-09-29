// scripts/buildComprehensiveListening.js
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../src/data/ieltsData.json');
const currentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// High-fidelity themes for 20 tests
const testDefinitions = [
  {
    id: 1,
    title: "IELTS Listening Test 1 • Outdoor Recreation & Natural Sciences",
    p1: {
      topic: "River Valley Wildlife Kayak Tour Booking",
      dialogue: [
        ["Agent", "Good morning! Welcome to High Peak Outdoor Adventures. How may I assist you today?"],
        ["Customer", "Hello there. I'd like to book some places on the River Valley Wildlife Kayak Tour for this coming weekend, please."],
        ["Agent", "Excellent choice! Before we check available slots, could I take your full name, please?"],
        ["Customer", "Yes, certainly. My first name is David, and my surname is Henderson. That's H-E-N-D-E-R-S-O-N."],
        ["Agent", "Thank you, Mr Henderson. And what would be the best contact telephone number for you?"],
        ["Customer", "It is 07700 900342."],
        ["Agent", "Great. Now, which day are you planning to do the kayak tour? We run sessions on Saturday and Sunday."],
        ["Customer", "We definitely prefer Saturday because we have family commitments on Sunday."],
        ["Agent", "Saturday it is. And how many people will be in your party?"],
        ["Customer", "There will be four of us in total—myself, my partner, and our two teenage sons."],
        ["Agent", "Wonderful. We have morning and afternoon slots. The morning group departs at 9:30 am, and the afternoon group leaves at 2:00 pm."],
        ["Customer", "9:30 am would suit us much better so we can enjoy the rest of the day."],
        ["Agent", "Perfect. Regarding the tour package, all participants are provided with safety equipment, including a buoyancy vest and a waterproof jacket."],
        ["Customer", "That's reassuring. Do we need to bring our own paddles or waterproof bags?"],
        ["Agent", "We supply high-grade paddles, but you should bring your own waterproof dry bag for phones or cameras."],
        ["Customer", "Understood. Where exactly do we assemble on Saturday morning?"],
        ["Agent", "All kayakers meet at the Mill Bridge Car Park, right beside the wooden boathouse."],
        ["Customer", "Mill Bridge Car Park, got it. And what is the fee per person for the four-hour session?"],
        ["Agent", "It is £35 per adult, but since teenagers qualify for the student rate of £25, your total comes to £120."],
        ["Customer", "That sounds very fair. Can I pay the deposit now over the phone?"],
        ["Agent", "Yes, we require a £30 deposit paid by credit card to secure the booking, and the balance can be settled on arrival."],
        ["Customer", "Superb, let me give you the card details now..."]
      ],
      questions: [
        { type: "completion", q: "Customer's surname: ______", answer: "Henderson" },
        { type: "completion", q: "Contact telephone number: ______", answer: "07700 900342 | 07700900342" },
        { type: "completion", q: "Preferred day of the kayak tour: ______", answer: "Saturday" },
        { type: "completion", q: "Total number of participants in the group: ______", answer: "4 | four" },
        { type: "completion", q: "Selected departure time: ______", answer: "9:30 am | 9.30 am | 9:30 | 9.30" },
        { type: "completion", q: "Equipment provided to all participants: buoyancy vest and waterproof ______", answer: "jacket" },
        { type: "completion", q: "Item participants must bring themselves: waterproof ______", answer: "dry bag | bag" },
        { type: "completion", q: "Meeting location on Saturday: ______ Car Park", answer: "Mill Bridge" },
        { type: "completion", q: "Discounted fee for teenagers: £______ per person", answer: "25 | 25 pounds | £25" },
        { type: "completion", q: "Method required for paying the deposit: ______", answer: "credit card | card" }
      ]
    },
    p2: {
      topic: "Oakwood Woodland & Nature Reserve Orientation",
      monologue: [
        "Good morning, everyone, and a warm welcome to Oakwood Nature Reserve! My name is Claire Jenkins, and I'm the senior reserve warden here. Before you set off exploring our two hundred hectares of native ancient woodland, let me share some essential orientation details.",
        "First of all, the primary aim of Oakwood is the protection of endangered red squirrels and wetland kingfishers. Because of ongoing habitat preservation, visitors are strictly required to remain on the demarcated timber pathways. Stepping off the paths disrupts delicate moss ecosystems and nesting ground birds.",
        "Secondly, regarding opening times: the main entrance gates open daily at 8:00 am and lock automatically at sunset, which currently stands at 7:30 pm. Anyone parked in the visitors' bay after this hour will need to call security.",
        "Now, turning to our facilities. If you look at the reserve map, the Welcome Pavilion where we are standing right now houses the information desk and public restrooms. Immediately to the east of the pavilion is our newly opened Heritage Café, which serves organic refreshments and light lunches made from local farm produce. Behind the café, you will find secure bicycle racks and complimentary luggage lockers for your rucksacks.",
        "For wildlife photography enthusiasts, the best vantage point is the High Hide, located at the northern edge of Blackwood Marsh. To reach it, take the Blue Trail past the old watermill and follow the signs for approximately fifteen minutes. In the morning, you are almost guaranteed to see grey herons and otters feeding in the reeds.",
        "Please note that dogs are allowed on the reserve, but they must be kept on a short lead of two metres or less at all times. We also ask that you take all litter home, as there are no bins on the forest trails to avoid attracting wild foxes.",
        "Finally, guided ranger walks run every Tuesday and Saturday at 11:00 am, departing from the sundial lawn just outside the café. These walks are completely free of charge, but places are capped at twenty people, so please sign up at the information desk. Thank you for your attention, and enjoy your day at Oakwood!"
      ],
      questions: [
        {
          type: "mcq",
          q: "What is the primary conservation focus of Oakwood Nature Reserve?",
          options: ["Protecting red squirrels and wetland kingfishers", "Breeding rare species of deer", "Planting commercial timber forests", "Reintroducing wild wolves"],
          answer: 0
        },
        {
          type: "mcq",
          q: "Why are visitors strictly instructed to stay on the timber pathways?",
          options: ["To prevent getting lost in the marshland", "To protect delicate moss and ground-nesting birds", "Because wild animals frequently cross the paths", "To avoid muddy terrain after heavy rainfall"],
          answer: 1
        },
        {
          type: "mcq",
          q: "At what time do the reserve gates lock automatically?",
          options: ["5:00 pm", "6:30 pm", "7:30 pm", "9:00 pm"],
          answer: 2
        },
        {
          type: "mcq",
          q: "Where is the newly opened Heritage Café located?",
          options: ["Immediately east of the Welcome Pavilion", "At the northern end of Blackwood Marsh", "Beside the old watermill", "Next to the entrance gates"],
          answer: 0
        },
        {
          type: "mcq",
          q: "What rule applies to visitors bringing dogs to the reserve?",
          options: ["Dogs are completely prohibited", "Dogs must be kept on a short lead of two metres or less", "Dogs can roam free on the Blue Trail", "Dogs are only permitted inside the café garden"],
          answer: 1
        },
        { type: "completion", q: "Facilities behind the café include bicycle racks and complimentary ______", answer: "luggage lockers | lockers" },
        { type: "completion", q: "The premier observation vantage point for photography is called the ______ Hide", answer: "High" },
        { type: "completion", q: "To reach the marsh hide, visitors should follow the ______ Trail", answer: "Blue" },
        { type: "completion", q: "Free guided ranger walks depart every Tuesday and Saturday at ______", answer: "11:00 am | 11.00 am | 11 am | 11:00" },
        { type: "completion", q: "Ranger walk groups meet outside the café at the ______ lawn", answer: "sundial" }
      ]
    },
    p3: {
      topic: "Renewable Architecture & Passive Cooling Project",
      dialogue: [
        ["Prof. Davies", "Come in, Emma, Jack. Please take a seat. I've reviewed your initial proposal for the low-energy municipal library project. Overall, your focus on passive environmental design is very commendable, but let's look at the specific engineering aspects. Jack, how did you choose the primary structural materials?"],
        ["Jack", "Well, professor, we initially considered recycled structural steel, but after running carbon footprint simulations, we decided to specify cross-laminated timber instead. It acts as a long-term carbon sink and drastically reduces embodied emissions during construction."],
        ["Emma", "And for the exterior cladding, we selected locally quarried limestone rather than aluminium composite panels. It provides superior thermal mass, which helps buffer internal temperatures against extreme summer heatwaves."],
        ["Prof. Davies", "Very sensible. Now, what about your passive ventilation strategy? The atrium airflow diagram in your report looks promising, but how will you handle stale air extraction?"],
        ["Emma", "We designed a central thermal chimney inspired by traditional Middle Eastern wind towers. Warm indoor air rises naturally due to buoyancy and exhausts through automated roof louvres, drawing cooler air in from the landscaped shaded courtyards at ground level."],
        ["Jack", "Exactly. We also integrated underground concrete earth tubes. Fresh ventilation air passes through these subterranean channels before entering the building, naturally pre-cooling the air by about four to five degrees Celsius during peak summer without mechanical refrigeration."],
        ["Prof. Davies", "That's an elegant solution. However, I noticed a potential weakness in your acoustic insulation plan. In an open-plan library with a central atrium, sound from the ground floor café could travel straight up into the silent reading balconies on the third floor."],
        ["Emma", "That's a valid point, professor. Jack and I realized that last night. We plan to install perforated timber acoustic baffles and acoustic felt panels behind the bookshelf dividers to absorb high-frequency noise."],
        ["Prof. Davies", "Excellent. Make sure you include quantitative reverberation time calculations in your revised draft. And what software are you using to simulate your natural daylight distribution?"],
        ["Jack", "We've been using Radiance coupled with Rhino's Grasshopper plugin. It allows us to optimize the angle of external photovoltaic shading louvres so that daylight penetrates thirty metres into the floor plate while eliminating direct glare on computer screens."],
        ["Prof. Davies", "Outstanding. Remember that the formal submission deadline for the design dossier is Friday the twenty-fourth of November at 5:00 pm. You will also need to submit a physical scale model at a ratio of one to one hundred."],
        ["Emma", "Understood, professor. We'll finalize the reverberation calculations by this Wednesday. Thank you for your feedback!"]
      ],
      questions: [
        {
          type: "mcq",
          q: "Why did Emma and Jack choose cross-laminated timber for the building's main structure?",
          options: ["It is cheaper than recycled concrete", "It acts as a carbon sink and lowers embodied emissions", "It provides total fire immunity", "It can be sourced from any overseas supplier"],
          answer: 1
        },
        {
          type: "mcq",
          q: "What material was chosen for the exterior cladding to provide high thermal mass?",
          options: ["Locally quarried limestone", "Polished aluminium composite panels", "Double-glazed reflective glass", "Precast hollow brickwork"],
          answer: 0
        },
        {
          type: "mcq",
          q: "What architectural concept inspired the building's central thermal ventilation chimney?",
          options: ["Roman aqueduct ventilation", "Traditional Middle Eastern wind towers", "Nordic turf roof insulation", "Modern aircraft cooling turbines"],
          answer: 1
        },
        {
          type: "mcq",
          q: "What concern did Professor Davies raise regarding the open atrium layout?",
          options: ["Risk of rainwater leakage during storms", "Excessive glare on reading tables", "Sound traveling upwards from the café into quiet study zones", "Inadequate emergency fire escape routes"],
          answer: 2
        },
        {
          type: "mcq",
          q: "How will fresh ventilation air be naturally pre-cooled before entering the rooms?",
          options: ["Passing through roof water tanks", "Flowing through subterranean concrete earth tubes", "Using solar-powered air conditioning pumps", "Extracting mist from artificial fountains"],
          answer: 1
        },
        { type: "completion", q: "To absorb noise, students will install perforated acoustic baffles made of ______", answer: "timber | wood" },
        { type: "completion", q: "The simulation software used alongside Grasshopper for daylight analysis is ______", answer: "Radiance" },
        { type: "completion", q: "External photovoltaic louvres allow daylight to penetrate ______ metres inside", answer: "30 | thirty" },
        { type: "completion", q: "Final submission date for the architectural dossier: Friday ______ November", answer: "24th | 24 | twenty-fourth" },
        { type: "completion", q: "Required scale ratio for the physical architectural model: 1 to ______", answer: "100 | one hundred" }
      ]
    },
    p4: {
      topic: "Academic Lecture on Bat Bio-acoustics and Ultrasonic Echolocation",
      monologue: [
        "Good afternoon, students. Today we continue our module on sensory biology by examining one of nature's most sophisticated biosonar systems: ultrasonic echolocation in microbats, or microchiroptera.",
        "For centuries, natural philosophers wondered how bats could navigate in pitch-black caves without colliding with stalactites or rock walls. It was not until 1793 that the Italian naturalist Lazzaro Spallanzani conducted pioneering experiments showing that blindfolded bats navigated with flawless precision, whereas bats whose ears were plugged with wax became completely disoriented. However, the true acoustic nature of this sense was only proven in 1938, when Donald Griffin at Harvard University used newly invented high-frequency microphones to detect the ultrasonic pulses emitted by flying bats.",
        "So how does this system function physically? Microbats produce ultrasonic sound waves in their larynx. These pulses are emitted either through their mouth or, in the case of horseshoe bats, through specialized leaf-shaped nasal structures that focus sound like an acoustic megaphone. The frequencies utilized typically range between 20 kilohertz and an astonishing 200 kilohertz, far above the 20 kilohertz upper hearing threshold of human ears.",
        "When these ultrasonic pulses strike an object—whether it is a solid tree trunk or a tiny flying mosquito—an echo rebounds back to the bat. By analyzing minute differences between the emitted call and the returning echo, the bat's auditory cortex can compute several critical variables simultaneously. First, the time delay between call emission and echo return indicates the exact distance to the target, with an accuracy of down to a fraction of a millimetre.",
        "Second, the Doppler shift—the change in frequency caused by relative movement—reveals the target's flight velocity and direction. If a moth is flying towards the bat, the returning echo has a higher pitch; if it is fleeing, the echo shifts lower.",
        "Furthermore, bats adjust their acoustic output dynamically during hunting. In the search phase, a bat emits about 10 pulses per second. As it detects an insect and closes in, it accelerates its pulse rate dramatically into what biologists call a 'terminal buzz', emitting up to 200 pulses per second in the final fractions of a second before capture.",
        "To protect their own delicate inner ears from being deafened by their intense outgoing pulses, bats have evolved an extraordinary physiological mechanism: middle ear muscles called the stapedius and tensor tympani contract milliseconds before vocalization, physically decoupling the ossicle bones and dampening hearing sensitivity. They relax instantly afterwards to detect the faint returning echo.",
        "In recent years, engineers have turned to bat bio-acoustics to design advanced biomimetic sensors. For instance, automotive developers are creating collision-avoidance radar systems inspired by the frequency-modulated sweeps of bats, which perform exceptionally well in foggy conditions where optical cameras fail. In robotics, autonomous drones equipped with ultrasonic sonar can now map subterranean mining tunnels without GPS. In our next lecture, we will look at how certain species of tiger moths have evolved ultrasonic jamming defense clicks to confuse attacking bats. Thank you."
      ],
      questions: [
        { type: "completion", q: "The 18th-century scientist who discovered bats relied on hearing was Lazzaro ______", answer: "Spallanzani" },
        { type: "completion", q: "In 1938, Donald Griffin detected bat ultrasonic calls at ______ University", answer: "Harvard" },
        { type: "completion", q: "Horseshoe bats emit ultrasound through specialized structures on their ______", answer: "nose | nasal structures" },
        { type: "completion", q: "Bat echolocation frequencies can reach as high as ______ kilohertz", answer: "200 | two hundred" },
        { type: "completion", q: "The time delay of returning echoes allows the bat to calculate target ______", answer: "distance" },
        { type: "completion", q: "Target flight speed and direction are determined using the ______ shift effect", answer: "Doppler" },
        { type: "completion", q: "During final prey capture, pulse frequency increases into a terminal ______", answer: "buzz" },
        { type: "completion", q: "Middle ear muscles contract to protect bats from being ______ by their own calls", answer: "deafened | damaged" },
        { type: "completion", q: "Engineers apply bat sonar principles to develop vehicle collision sensors effective in ______", answer: "fog | foggy conditions" },
        { type: "completion", q: "Autonomous drones use ultrasonic biosonar to map underground ______ without GPS", answer: "mines | mining tunnels | tunnels" }
      ]
    }
  }
];

console.log("Specs ready for test 1. Writing builder for all 20 tests...");
