/*
 * Everything on the retreat page comes from this file; retreat.js lays it out.
 *
 * Talks: fill in speaker, institution, title and abstract in the schedule (days → items). A talk
 * without a speaker shows as "To be announced", and once a talk has a title it also gets a card in
 * the Talks section. Abstracts may use LaTeX: $...$ or \(...\) inline, $$...$$ or \[...\] displayed
 * (in this file a backslash is written twice: '\\mathbb{R}').
 * Times are 24-hour, India time (IST). An item without an end runs until the next item starts.
 * Item types: talk, discussion, meal, break, other.
 */
window.RETREAT = {
  title: 'Geometry Retreat 2026',
  shortTitle: 'Retreat 2026',
  start: '2026-12-03',
  end: '2026-12-06',
  place: 'IIIT-Delhi, New Delhi',
  tagline: 'Four days of talks and discussion among geometers from IIIT-Delhi, Shiv Nadar University and IIT Delhi.',
  invitation: 'Participation is by invitation; there is no registration or application.',

  about: [
    'The retreat brings together geometers and topologists from IIIT-Delhi, Shiv Nadar University and IIT Delhi for a few days of mathematics away from the usual routine of teaching and administration. The idea is simple: a small group, long talks, and plenty of time to talk to each other.',
    'Mornings are for talks. Each speaker has fifty minutes, followed by ten minutes for questions, which leaves room to explain not just the results but the geometry behind them: the examples, the pictures, the constructions that make a proof work, and the questions that are still open. On the afternoon of the third day, PhD students give half-hour talks.',
    'The afternoons are for discussion, and a room is reserved for it throughout the retreat: going through a construction at the board, seeing how the same problem looks from different corners of geometry and topology, and finding questions worth working on together.',
  ],
  talkFormat: 'Each talk is 50 minutes, followed by 10 minutes for questions; PhD student talks are half an hour.',

  institutions: [
    { name: 'IIIT-Delhi', full: 'Indraprastha Institute of Information Technology Delhi', url: 'https://www.iiitd.ac.in/', host: true },
    { name: 'SNU', full: 'Shiv Nadar University, Delhi NCR', url: 'https://snu.edu.in/' },
    { name: 'IIT Delhi', full: 'Indian Institute of Technology Delhi', url: 'https://home.iitd.ac.in/' },
  ],
  // { name: 'Full name', institution: 'SNU', url: 'https://…', student: true }   (institution: a name from the list above)
  // shown under their institution in this order (alphabetical by surname); url and student are optional
  participants: [
    { name: 'Prahllad Deb', institution: 'IIIT-Delhi', url: 'https://iiitd.ac.in/prahllad' },
    { name: 'Subhankar Dhara', institution: 'IIIT-Delhi' },
    { name: 'Kajal Gahtyari', institution: 'IIIT-Delhi' },
    { name: 'Suvam Goswami', institution: 'IIIT-Delhi' },
    { name: 'Sachchidanand Prasad', institution: 'IIIT-Delhi', url: 'https://prasadsachchidanand.github.io/' },
    { name: 'Nabanita Ray', institution: 'IIIT-Delhi', url: 'https://iiitd.ac.in/nabanita' },
    { name: 'Sonali Saha', institution: 'IIIT-Delhi' },
    { name: 'Ujjal Timshina', institution: 'IIIT-Delhi' },
    { name: 'Jyoti Yadav', institution: 'IIIT-Delhi' },

    { name: 'Abhijit Jana', institution: 'IIT Delhi' },
    { name: 'Pinakinath Saha', institution: 'IIT Delhi' },
    { name: 'Soumyajit Sarkar', institution: 'IIT Delhi' },

    { name: 'Indranil Biswas', institution: 'SNU' },
    { name: 'Pradip Kumar', institution: 'SNU' },
    { name: 'Shivani Mishra', institution: 'SNU' },
    { name: 'Hariom Singh', institution: 'SNU' },
  ],

  // listed alphabetically by surname; url and email are optional
  organisers: [
    { name: 'Prahllad Deb', institution: 'IIIT-Delhi', url: 'https://iiitd.ac.in/prahllad' },
    { name: 'Sachchidanand Prasad', institution: 'IIIT-Delhi', url: 'https://prasadsachchidanand.github.io/' },
    { name: 'Nabanita Ray', institution: 'IIIT-Delhi', url: 'https://iiitd.ac.in/nabanita' },
  ],
  venue: {
    name: 'Indraprastha Institute of Information Technology Delhi (IIIT-Delhi)',
    address: 'Okhla Industrial Estate, Phase III, New Delhi 110020',
    room: '',             // room for the talks, e.g. 'Room A-106, Academic Block'
    discussionRoom: '',   // the room reserved for open discussions
    map: 'https://www.google.com/maps/search/?api=1&query=IIIT-Delhi%2C+Okhla+Phase+III%2C+New+Delhi',
  },
  funding: 'We thank the Department of Mathematics, IIIT-Delhi, for funding the retreat.',

  days: [
    {
      date: '2026-12-03',
      summary: 'Arrival and dinner',
      items: [
        { start: '18:00', type: 'other', title: 'Arrival' },
        { start: '19:30', end: '21:00', type: 'meal', title: 'Welcome dinner' },
      ],
    },
    {
      date: '2026-12-04',
      summary: 'Talks in the morning; discussion in the afternoon',
      items: [
        { start: '08:00', end: '09:00', type: 'meal', title: 'Breakfast' },
        { start: '09:30', end: '10:30', type: 'talk', speaker: '', institution: '', title: '', abstract: '' },
        { start: '10:30', end: '11:00', type: 'break', title: 'Tea' },
        { start: '11:00', end: '12:00', type: 'talk', speaker: '', institution: '', title: '', abstract: '' },
        { start: '12:00', end: '13:00', type: 'talk', speaker: '', institution: '', title: '', abstract: '' },
        { start: '13:00', end: '14:30', type: 'meal', title: 'Lunch' },
        { start: '14:30', end: '16:00', type: 'discussion', title: 'Discussion', note: 'In the discussion room, in small groups or at the board' },
        { start: '16:00', end: '16:30', type: 'break', title: 'Tea' },
        { start: '16:30', end: '18:00', type: 'discussion', title: 'Discussion' },
        { start: '19:30', end: '21:00', type: 'meal', title: 'Dinner' },
      ],
    },
    {
      date: '2026-12-05',
      summary: 'Talks in the morning; PhD student talks and discussion in the afternoon',
      items: [
        { start: '08:00', end: '09:00', type: 'meal', title: 'Breakfast' },
        { start: '09:30', end: '10:30', type: 'talk', speaker: '', institution: '', title: '', abstract: '' },
        { start: '10:30', end: '11:00', type: 'break', title: 'Tea' },
        { start: '11:00', end: '12:00', type: 'talk', speaker: '', institution: '', title: '', abstract: '' },
        { start: '12:00', end: '13:00', type: 'talk', speaker: '', institution: '', title: '', abstract: '' },
        { start: '13:00', end: '14:30', type: 'meal', title: 'Lunch' },
        { start: '14:30', end: '15:00', type: 'talk', student: true, speaker: '', institution: '', title: '', abstract: '' },
        { start: '15:00', end: '15:30', type: 'talk', student: true, speaker: '', institution: '', title: '', abstract: '' },
        { start: '15:30', end: '16:00', type: 'break', title: 'Tea' },
        { start: '16:00', end: '18:00', type: 'discussion', title: 'Discussion', note: 'In the discussion room, in small groups or at the board' },
        { start: '19:30', end: '21:00', type: 'meal', title: 'Dinner' },
      ],
    },
    {
      date: '2026-12-06',
      summary: 'Breakfast and departure',
      items: [
        { start: '08:00', end: '09:30', type: 'meal', title: 'Breakfast' },
        { start: '09:30', type: 'other', title: 'Departure' },
      ],
    },
  ],
};
