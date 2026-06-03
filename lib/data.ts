export const services = [
  { index: "01", title: "General Dentistry", category: "Foundation",
    description: "Comprehensive oral health care for the entire family. Regular cleanings remove plaque and tartar buildup, preventing decay and gum disease. Our hygienists deliver a level of clean that home brushing simply cannot match.",
    includes: ["Teeth Cleaning & Polishing", "Fillings & Restorations", "Oral Health Examinations", "X-Rays & Diagnostics"] },
  { index: "02", title: "Invisalign Correction", category: "Orthodontics",
    description: "Straighten your teeth without metal brackets using a series of custom-fit clear aligners. Removable for eating and cleaning, Invisalign delivers the same results as traditional braces — discreetly, on your schedule.",
    includes: ["Custom Clear Aligner Trays", "Digital Treatment Planning", "Progress Monitoring", "Retainer Fitting"] },
  { index: "03", title: "Cosmetic Makeovers", category: "Aesthetics",
    description: "Transform your smile with professional whitening, bonding, and cosmetic procedures designed to enhance your natural beauty. We focus on results that look and feel completely natural.",
    includes: ["Professional Teeth Whitening", "Composite Bonding", "Smile Design Consultation", "Cosmetic Contouring"] },
  { index: "04", title: "Crowns & Bridges", category: "Restoration",
    description: "Restore damaged or missing teeth with precision-crafted crowns and bridges. Each restoration is laboratory-fabricated to match your natural tooth colour and bite, cemented permanently for lasting function.",
    includes: ["Porcelain Crowns", "Fixed Dental Bridges", "Crown Lengthening", "Temporary Restorations"] },
  { index: "05", title: "Dental Implants", category: "Implantology",
    description: "The gold standard for replacing missing teeth. A titanium implant anchors a prosthetic tooth permanently to your jawbone, looking and functioning exactly like a natural tooth while preserving bone density.",
    includes: ["Titanium Implant Placement", "Custom Prosthetic Crown", "Bone Preservation", "Full Implant Consultation"] },
  { index: "06", title: "Emergency Dentistry", category: "Urgent Care",
    description: "Dental emergencies require immediate attention. Our team handles urgent root canals, extractions, cracked teeth, and severe pain — providing same-day relief when you need it most.",
    includes: ["Emergency Root Canals", "Urgent Extractions", "Cracked Tooth Repair", "Pain Management"] },
  { index: "07", title: "Root Canal Therapy", category: "Endodontics",
    description: "When decay reaches the pulp of a tooth, root canal therapy eliminates the infection and saves the tooth. Modern techniques make this procedure comfortable and often completed in a single visit.",
    includes: ["Pulp Chamber Cleaning", "Canal Shaping & Sealing", "Post-Treatment Crown", "Infection Management"] },
  { index: "08", title: "Pediatric Dentistry", category: "Family",
    description: "Dr. Do's gentle, friendly approach makes him a natural with children. We create positive dental experiences from an early age, building healthy habits that last a lifetime.",
    includes: ["Children's Cleanings", "Fluoride Treatments", "Sealants", "Early Orthodontic Assessment"] },
];

export const showcase = [
  { label: "01 / General Dentistry", title: "Clean, healthy foundations", description: "Regular cleanings and preventive care that keep your smile bright and your gums healthy for life.", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=700&fit=crop", tag: "Prevention" },
  { label: "02 / Invisalign", title: "Straight teeth, invisibly", description: "Custom clear aligners that gradually perfect your smile — no metal, no discomfort, no compromise.", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=700&fit=crop&crop=face", tag: "Orthodontics" },
  { label: "03 / Cosmetic", title: "Your best smile, crafted", description: "Professional whitening, bonding, and cosmetic contouring designed to enhance your natural beauty.", image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=700&fit=crop", tag: "Aesthetics" },
  { label: "04 / Implants", title: "Permanent. Natural. Yours.", description: "Titanium implants that anchor a prosthetic tooth permanently — indistinguishable from the real thing.", image: "/assets/dental_implant.jpg", tag: "Restoration" },
  { label: "05 / Emergency", title: "Relief when you need it", description: "Same-day emergency appointments for urgent pain, broken teeth, and acute dental needs.", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=700&fit=crop", tag: "Urgent Care" },
];

export type Person = {
  name: string; role: string; specialty: string; image: string;
  credentials: string[]; bio: string; highlight: string;
};

export const dentalTeam: Person[] = [
  { name: "Dr. Tam Do", role: "Principal Dentist", specialty: "General & Family Dentistry",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=480&h=480&fit=crop&crop=face",
    credentials: ["DMD — UBC Faculty of Dentistry, 2004", "BSc Biochemistry — UBC (Entrance Scholarship)", "99th Percentile — Dental Aptitude Exam", "Oral Medicine & Oral Pathology Award"],
    bio: "Dr. Do spent his formative years across Northern Canada before calling Vancouver home for the past 14 years with his wife and three children. His gentle, outwardly friendly nature translates directly into his practice — creating an environment where patients of all ages feel genuinely at ease. Beyond general and family dentistry, Dr. Do is passionate about cosmetic procedures, Invisalign, and pediatric care.",
    highlight: "UBC Faculty Trained" },
  { name: "Dr. Largani", role: "Principal Dentist", specialty: "Orthodontics & Clinical Excellence",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=480&h=480&fit=crop&crop=face",
    credentials: ["DMD — University of British Columbia, 2009", "Dean's List Graduate", "Award for Best Clinical Practice", "Award for Best Orthodontics"],
    bio: "Dr. Largani brings a dual academic pedigree — graduating from Shahid Beheshti University in Tehran before earning his DMD at UBC, where he placed on the Dean's List and received awards for both clinical practice and orthodontics. His philosophy centres on providing the highest quality of care through continuous learning and active participation in study clubs.",
    highlight: "Dean's List Graduate" },
  { name: "Sarah Whitfield", role: "Registered Dental Hygienist", specialty: "Preventive & Periodontal Care",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=480&h=480&fit=crop&crop=face",
    credentials: ["Dip. Dental Hygiene — Vancouver College", "Certified in Local Anaesthesia", "Periodontal Therapy Specialist"],
    bio: "Sarah has cared for Kingsgate families for over a decade, and is known for her unhurried, gentle touch. She believes prevention is the foundation of lifelong oral health, and takes the time to coach every patient through a routine that actually fits their life.",
    highlight: "10+ Years at Kingsgate" },
  { name: "Daniel Cho", role: "Registered Dental Hygienist", specialty: "Hygiene & Patient Comfort",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=480&h=480&fit=crop&crop=face",
    credentials: ["Dip. Dental Hygiene — Camosun College", "Certified in Nitrous Oxide Sedation", "Anxiety-Friendly Care Trained"],
    bio: "Daniel specialises in making nervous patients feel safe. With a calm, methodical approach and a knack for explaining exactly what's happening, he has helped many anxious first-timers become comfortable regulars.",
    highlight: "Anxiety-Friendly Care" },
];

export const adminTeam: Person[] = [
  { name: "Maria Alvarez", role: "Office Manager", specialty: "Practice Operations",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&h=480&fit=crop&crop=face",
    credentials: ["15 Years in Dental Administration", "Insurance & Billing Specialist", "Patient Experience Lead"],
    bio: "Maria keeps Kingsgate running smoothly behind the scenes — from scheduling and insurance to making sure every patient feels welcomed the moment they walk in. If you have a question about your visit, she's the one with the answer.",
    highlight: "Patient Experience Lead" },
  { name: "Priya Nair", role: "Treatment Coordinator", specialty: "Care Planning & Financing",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=480&h=480&fit=crop&crop=face",
    credentials: ["Certified Dental Assistant", "Treatment Planning Specialist", "Financing & Benefits Advisor"],
    bio: "Priya translates clinical treatment plans into clear, jargon-free steps and helps patients understand their coverage and financing options. Her goal is simple: no surprises, just a path forward you feel good about.",
    highlight: "No-Surprises Planning" },
  { name: "Emily Tran", role: "Front Desk Coordinator", specialty: "Reception & Scheduling",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=480&h=480&fit=crop&crop=face",
    credentials: ["Front Office Administration", "Multilingual — EN / FR / VI", "New Patient Onboarding"],
    bio: "Emily is the friendly first voice you'll hear when you call Kingsgate. She handles bookings, reminders, and new-patient paperwork with warmth and precision, so your visit starts on the right foot.",
    highlight: "Your First Hello" },
];

export const faqCategories = [
  { id: "new-patients", label: "New Patients", faqs: [
    { index: "01", q: "Are you accepting new patients?", a: "Yes — we warmly welcome new patients of all ages. Simply call us at (604) 879-9999 or use the contact form below to book your first appointment. We'll take care of the rest." },
    { index: "02", q: "What should I bring to my first appointment?", a: "Please bring a valid photo ID, your dental insurance card (if applicable), and a list of any medications you're currently taking. Arriving 10 minutes early allows us to complete your intake paperwork comfortably." },
    { index: "03", q: "Do you see children?", a: "Absolutely. Dr. Do has a natural gift with young patients and takes extra care to make their first dental experiences positive and stress-free. We recommend bringing children in for their first visit around age 2–3." },
    { index: "04", q: "Do you offer emergency appointments?", a: "Yes. We reserve time in our daily schedule for dental emergencies. If you're experiencing severe pain, a broken tooth, or a lost filling, call us immediately at (604) 879-9999 and we'll see you as soon as possible." },
  ]},
  { id: "services", label: "Services", faqs: [
    { index: "01", q: "What dental services do you offer?", a: "We provide a comprehensive range of services including teeth cleanings, fillings, whitening, Invisalign, crowns, bridges, dental implants, root canals, extractions, and pediatric dentistry — all under one roof." },
    { index: "02", q: "How long does Invisalign treatment take?", a: "Treatment duration varies depending on the complexity of your case. Most patients complete their Invisalign journey in 6–18 months. During your consultation, Dr. Do will provide a personalised treatment timeline." },
    { index: "03", q: "How long does professional whitening take?", a: "Professional in-office whitening typically takes one to two hours and can lighten teeth by several shades in a single session. We also offer custom take-home trays for a more gradual approach." },
  ]},
  { id: "comfort", label: "Comfort & Safety", faqs: [
    { index: "01", q: "I have dental anxiety. How do you help?", a: "We understand that dental anxiety is real and common. Our clinic is designed to be calming — with Skyfactory ceiling imagery, individual TVs, and a team that moves at your pace. Please let us know about your concerns when booking so we can prepare accordingly." },
    { index: "02", q: "Is dental treatment painful?", a: "Modern dentistry has come a long way. We use effective local anaesthesia for all procedures that require it, and our team is trained to minimize discomfort at every step. Most patients are pleasantly surprised by how comfortable their experience is." },
  ]},
  { id: "location", label: "Location & Hours", faqs: [
    { index: "01", q: "Where are you located?", a: "We are located at 370 East Broadway, Suite 112, on the lower level of Kingsgate Mall — at the intersection of East Broadway and Kingsway in the Mt. Pleasant neighbourhood of Vancouver." },
    { index: "02", q: "Is parking available?", a: "Yes, free parking is available directly outside the clinic in the Kingsgate Mall parking lot. We are also accessible by public transit via the 99 B-Line and multiple bus routes along Broadway." },
    { index: "03", q: "What are your hours?", a: "We are open Monday through Saturday, 9:30am to 5:30pm. We are closed on Sundays and statutory holidays. We recommend calling ahead to confirm availability, especially for same-day appointments." },
  ]},
];

export const smileGallery = {
  left: [
    { id: "smile-01", ar: "4/5",  src: "/assets/veneers.jpg.jpg",              alt: "Porcelain veneers — natural-looking smile restoration",          tags: ["Veneers"] },
    { id: "smile-02", ar: "3/2",  src: "/assets/comprehensive-care..jpg",       alt: "Comprehensive care — full smile transformation",                 tags: ["Comprehensive Care"] },
    { id: "smile-03", ar: "4/5",  src: "/assets/dental-implants.jpg",           alt: "Dental implants — permanent tooth replacement",                  tags: ["Dental Implants"] },
    { id: "smile-04", ar: "1/1",  src: "/assets/orthodontics.jpg",              alt: "Orthodontic treatment — straight, aligned teeth",                tags: ["Orthodontics"] },
    { id: "smile-12", ar: "3/4",  src: "/assets/crowns.jpg",                    alt: "Dental crowns — precision-fitted porcelain restoration",          tags: ["Crowns"] },
    { id: "smile-13", ar: "1/1",  src: "/assets/therapy.jpg",                   alt: "Dental therapy — healthy, restored smile",                        tags: ["Therapy"] },
  ],
  mid: [
    { id: "smile-05", ar: "3/4",  src: "/assets/invisalign.jpg.jpg",            alt: "Invisalign — straighter smile with clear aligners",              tags: ["Invisalign"] },
    { id: "smile-06", ar: "4/5",  src: "/assets/bonding.jpg",                   alt: "Dental bonding — seamless tooth contouring and repair",           tags: ["Bonding"] },
    { id: "smile-07", ar: "1/1",  src: "/assets/complex-rehabilitation.jpg",    alt: "Complex rehabilitation — full mouth reconstruction result",        tags: ["Complex Rehabilitation"] },
    { id: "smile-14", ar: "4/5",  src: "/assets/veneers.jpg.jpg",               alt: "Porcelain veneers — natural-looking smile restoration",           tags: ["Veneers"] },
    { id: "smile-15", ar: "3/4",  src: "/assets/crowns.jpg",                    alt: "Dental crowns — precision-fitted porcelain restoration",          tags: ["Crowns"] },
  ],
  right: [
    { id: "smile-08", ar: "4/5",  src: "/assets/comprehensive-care..jpg",       alt: "Comprehensive care — full smile transformation",                  tags: ["Comprehensive Care"] },
    { id: "smile-09", ar: "1/1",  src: "/assets/dental-implants.jpg",           alt: "Dental implants — permanent tooth replacement",                  tags: ["Dental Implants"] },
    { id: "smile-10", ar: "3/4",  src: "/assets/orthodontics.jpg",              alt: "Orthodontic treatment — straight, aligned teeth",                 tags: ["Orthodontics"] },
    { id: "smile-11", ar: "4/5",  src: "/assets/therapy.jpg",                   alt: "Dental therapy — healthy, restored smile",                        tags: ["Therapy"] },
    { id: "smile-16", ar: "1/1",  src: "/assets/invisalign.jpg.jpg",            alt: "Invisalign — straighter smile with clear aligners",               tags: ["Invisalign"] },
    { id: "smile-17", ar: "3/4",  src: "/assets/bonding.jpg",                   alt: "Dental bonding — seamless tooth contouring and repair",           tags: ["Bonding"] },
  ],
};

export const CLINIC_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663722951681/SBghy8BxCzTguKrmFZLcP4/clinic-detail-e9UTFFGE88RAweL8Wsfify.webp";
export const SMILE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663722951681/SBghy8BxCzTguKrmFZLcP4/hero-smile-7MJiXMymRx3DGFw3wwfq76.webp";
