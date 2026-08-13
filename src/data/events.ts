import summitImage from "@/assets/event-summit.jpg";
import workshopImage from "@/assets/event-workshop.jpg";
import expoImage from "@/assets/event-expo.jpg";

export interface EventItem {
  slug: string;
  title: string;
  month: string;
  day: string;
  fullDate: string;
  location: string;
  desc: string;
  image: string;
  imageAlt: string;
  featured: boolean;
}

/**
 * Informational event list. Content carried over from the existing site data —
 * no registration, hosts, categories or attendance figures.
 */
export const events: EventItem[] = [
  {
    slug: "global-tech-summit-2026",
    title: "Global Tech Summit 2026",
    month: "Sep",
    day: "15",
    fullDate: "September 15, 2026",
    location: "San Francisco, CA",
    desc: "Three days of keynotes, workshops, demos, and networking with tech leaders.",
    image: summitImage,
    imageAlt: "Speaker on a summit main stage in front of a seated audience",
    featured: true,
  },
  {
    slug: "ai-and-gadgets-masterclass",
    title: "AI & Gadgets Masterclass",
    month: "Sep",
    day: "28",
    fullDate: "September 28, 2026",
    location: "Virtual — Zoom",
    desc: "A 4-hour masterclass on AI-powered consumer devices with live demos and expert Q&A.",
    image: workshopImage,
    imageAlt: "Small group working with laptops and camera gear at a workshop table",
    featured: true,
  },
  {
    slug: "wearable-tech-expo",
    title: "Wearable Tech Expo",
    month: "Oct",
    day: "5",
    fullDate: "October 5, 2026",
    location: "New York, NY",
    desc: "Explore the latest in smartwatches, fitness trackers, AR glasses, and health monitors.",
    image: expoImage,
    imageAlt: "Visitors browsing smartwatches and headphones on white expo display tables",
    featured: true,
  },
  {
    slug: "developer-tools-summit",
    title: "Developer Tools Summit",
    month: "Oct",
    day: "20",
    fullDate: "October 20, 2026",
    location: "Austin, TX",
    desc: "A focused summit for developers building the next wave of hardware-software integrations.",
    image: summitImage,
    imageAlt: "Speaker on a summit main stage in front of a seated audience",
    featured: false,
  },
  {
    slug: "techhub-learning-month",
    title: "TechHub Learning Month",
    month: "Aug",
    day: "1",
    fullDate: "August 1–31, 2026",
    location: "Virtual",
    desc: "A month of daily live sessions, workshops, and expert panels. All sessions recorded.",
    image: workshopImage,
    imageAlt: "Instructor guiding participants during a hands-on technology session",
    featured: false,
  },
  {
    slug: "smart-home-challenge",
    title: "Smart Home Challenge",
    month: "Aug",
    day: "5",
    fullDate: "August 5–25, 2026",
    location: "Virtual",
    desc: "A three-week design challenge to build the best smart home setup.",
    image: workshopImage,
    imageAlt: "Participants collaborating with laptops during a design challenge",
    featured: false,
  },
  {
    slug: "ces-2026-member-meetup",
    title: "CES 2026 Member Meetup",
    month: "Jan",
    day: "8",
    fullDate: "January 8, 2026",
    location: "Las Vegas, NV",
    desc: "A TechHub gathering during CES 2026 for members and guests to meet the team.",
    image: expoImage,
    imageAlt: "Attendees browsing devices on display at a consumer electronics show",
    featured: false,
  },
  {
    slug: "audio-engineering-masterclass",
    title: "Audio Engineering Masterclass",
    month: "Mar",
    day: "12",
    fullDate: "March 12, 2026",
    location: "Virtual",
    desc: "An in-depth session on audio equipment selection and professional studio gear.",
    image: workshopImage,
    imageAlt: "Audio specialist demonstrating studio equipment to a small group",
    featured: false,
  },
];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}
