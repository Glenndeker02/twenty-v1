# Product Requirements Document

## AquaCoach - Swimming Lesson Platform

### Lesson Detail Page: Floating on Back

---

## Page Structure

### Header Section
```
┌──────────────────────────────────────┐
│ [←] Floating on Back        [···]   │
├──────────────────────────────────────┤
│ Beginner | Water Safety              │
│ Duration: 15 min                      │
│                                      │
│ Your Progress: 67% ████████▒▒▒      │
└──────────────────────────────────────┘
```

**Components:**
- Back button (← navigates to Learn screen)
- Lesson title
- More options menu (···)
  - Add to Favorites
  - Download for Offline
  - Share Lesson
  - Report Issue
- Metadata badges:
  - Difficulty level
  - Category
  - Duration
- Progress bar showing completion percentage

---

## Video Player Section

```
┌──────────────────────────────────────┐
│                                      │
│         [Video Player]               │
│         15:23 duration               │
│         ▶️ Play/Pause                │
│                                      │
│ [Playback controls]                  │
│ ◀◀ 10s | ▶️ Play | 10s ▶▶          │
│ ━━━━━━━━●━━━━━━━━━━━                │
│ 3:47 / 15:23                         │
│                                      │
│ [Speed] [CC] [Quality] [Fullscreen] │
└──────────────────────────────────────┘
```

**Features:**
- **Playback Speed Options:** 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
- **Closed Captions:** On/Off toggle
- **Video Quality:** Auto, 1080p, 720p, 480p, 360p
- **Fullscreen Mode**
- **10-Second Skip:** Forward/backward
- **Picture-in-Picture:** Continue watching while scrolling
- **Resume Playback:** Automatically resumes from last position
- **Chapters/Timestamps:**
  - 0:00 - Introduction
  - 1:30 - Body position basics
  - 4:15 - Head placement
  - 7:00 - Arm position
  - 10:30 - Common mistakes
  - 13:00 - Practice tips

**User Interactions:**
- Tap video to play/pause
- Tap timestamps to jump to section
- Swipe up while in fullscreen to see related lessons
- Progress auto-saves every 5 seconds

---

## Tab Navigation

```
[Overview] [Instructions] [Practice] [Discussion]
```

**Tab Behavior:**
- Sticky below video player
- Active tab highlighted
- Swipe left/right to navigate tabs
- Remembers last active tab per lesson

---

## OVERVIEW TAB

### Description Section
```
┌──────────────────────────────────────┐
│ LESSON DESCRIPTION                   │
├──────────────────────────────────────┤
│ Learn the fundamental skill of       │
│ floating on your back. This essential│
│ water safety technique helps you     │
│ stay calm and conserve energy in     │
│ deep water.                          │
│                                      │
│ In this lesson you'll learn:        │
│ • Correct body position              │
│ • Head and arm placement             │
│ • Breathing techniques               │
│ • How to relax and stay afloat       │
│                                      │
│ [Show More ▼]                        │
└──────────────────────────────────────┘
```

**Expandable Content:**
- Prerequisites
- Safety considerations
- Equipment needed
- Estimated time to master

### Learning Objectives
```
┌──────────────────────────────────────┐
│ WHAT YOU'LL LEARN                    │
├──────────────────────────────────────┤
│ ✓ Assume proper back float position │
│ ✓ Maintain horizontal body alignment│
│ ✓ Breathe comfortably while floating│
│ ✓ Recover to standing position      │
│ ✓ Understand when to use this skill │
└──────────────────────────────────────┘
```

### Prerequisites
```
┌──────────────────────────────────────┐
│ BEFORE YOU START                     │
├──────────────────────────────────────┤
│ Required Skills:                     │
│ ✓ Comfortable in shoulder-deep water│
│ ✓ Can submerge face underwater      │
│                                      │
│ Recommended (but not required):      │
│ ○ Basic front float                 │
│                                      │
│ [Review Prerequisites]               │
└──────────────────────────────────────┘
```

### Equipment Needed
```
┌──────────────────────────────────────┐
│ WHAT YOU'LL NEED                     │
├──────────────────────────────────────┤
│ Essential:                           │
│ • Pool or calm water (4+ feet deep) │
│ • Wall or edge for support          │
│                                      │
│ Optional:                            │
│ • Pool noodle or kickboard          │
│ • Nose clip (if needed)             │
│ • Buddy/instructor                   │
└──────────────────────────────────────┘
```

### Instructor Bio
```
┌──────────────────────────────────────┐
│ YOUR INSTRUCTOR                      │
├──────────────────────────────────────┤
│ [Photo] Coach Sarah Williams         │
│         ⭐⭐⭐⭐⭐ 4.9 (2,341 ratings)│
│                                      │
│ Red Cross certified swim instructor  │
│ 15+ years teaching experience        │
│ Specialized in adult learners        │
│                                      │
│ [View Profile] [Message]             │
└──────────────────────────────────────┘
```

---

## INSTRUCTIONS TAB

### Step-by-Step Guide

```
┌──────────────────────────────────────┐
│ STEP 1: STARTING POSITION            │
├──────────────────────────────────────┤
│ [Illustration/Photo]                 │
│                                      │
│ 1. Stand in chest-deep water near   │
│    the wall                          │
│ 2. Face away from wall              │
│ 3. Place both hands on pool edge    │
│    behind you                        │
│                                      │
│ [Video Clip Icon] "See demonstration"│
│ Jump to: 1:30 in lesson video        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ STEP 2: BODY POSITION                │
├──────────────────────────────────────┤
│ [Illustration/Photo]                 │
│                                      │
│ 1. Lean back slowly                 │
│ 2. Lift feet off bottom             │
│ 3. Keep hips up near surface        │
│ 4. Extend legs straight             │
│                                      │
│ 💡 KEY TIP:                         │
│ "Imagine a string pulling your      │
│ chest towards the sky"              │
│                                      │
│ [Video Clip Icon] "See demonstration"│
│ Jump to: 4:15 in lesson video        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ STEP 3: HEAD PLACEMENT               │
├──────────────────────────────────────┤
│ [Illustration/Photo]                 │
│                                      │
│ 1. Tilt head back                   │
│ 2. Ears should be underwater        │
│ 3. Eyes looking up at sky/ceiling   │
│ 4. Keep chin up                     │
│                                      │
│ ⚠️ COMMON MISTAKE:                  │
│ "Don't tuck chin to chest - this   │
│ causes hips to sink"                │
│                                      │
│ [Video Clip Icon] "See demonstration"│
│ Jump to: 7:00 in lesson video        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ STEP 4: ARM POSITION                 │
├──────────────────────────────────────┤
│ [Illustration/Photo]                 │
│                                      │
│ 1. Extend arms out to sides         │
│ 2. Palms facing up                  │
│ 3. Or place hands on stomach        │
│ 4. Keep arms relaxed                │
│                                      │
│ 💡 VARIATIONS:                      │
│ • Arms overhead (harder)            │
│ • Arms at sides (easier)            │
│ • Light sculling motions for        │
│   stability                          │
│                                      │
│ [Video Clip Icon] "See demonstration"│
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ STEP 5: BREATHING                    │
├──────────────────────────────────────┤
│ 1. Breathe normally                 │
│ 2. Don't hold your breath           │
│ 3. Exhale gently through nose to    │
│    prevent water entry               │
│                                      │
│ 💡 PRO TIP:                         │
│ "Try humming quietly - this keeps   │
│ air flowing out your nose"          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ STEP 6: RECOVERY TO STANDING         │
├──────────────────────────────────────┤
│ [Illustration/Photo]                 │
│                                      │
│ 1. Tuck knees to chest              │
│ 2. Bring chin forward               │
│ 3. Press down with hands            │
│ 4. Stand up slowly                  │
│                                      │
│ ⚠️ IMPORTANT:                       │
│ "Don't panic - the recovery is      │
│ gradual and controlled"             │
│                                      │
│ [Video Clip Icon] "See demonstration"│
│ Jump to: 12:45 in lesson video       │
└──────────────────────────────────────┘
```

### Safety Tips
```
┌──────────────────────────────────────┐
│ ⚠️ SAFETY FIRST                     │
├──────────────────────────────────────┤
│ • Always practice with someone      │
│   nearby (lifeguard, instructor,    │
│   or buddy)                          │
│ • Start in water you can stand in   │
│ • Stay near pool edge initially     │
│ • Don't practice if feeling tired   │
│   or anxious                         │
│ • Never float in areas with boat    │
│   traffic                            │
│                                      │
│ [Learn More: Water Safety]          │
└──────────────────────────────────────┘
```

### Key Points Checklist
```
┌──────────────────────────────────────┐
│ REMEMBER THESE KEY POINTS            │
├──────────────────────────────────────┤
│ ☐ Head back, ears in water          │
│ ☐ Chest up towards sky              │
│ ☐ Hips near surface                 │
│ ☐ Body relaxed, not tense           │
│ ☐ Breathe normally                  │
│ ☐ Arms extended or on stomach       │
│ ☐ Legs straight and relaxed         │
└──────────────────────────────────────┘
```

---

## PRACTICE TAB

### Practice Drills Section

```
[Filter/Sort]
[All Drills] [Beginner] [With Equipment] [Solo]

┌──────────────────────────────────────┐
│ ▼ DRILL 1: Wall-Assisted Back Float │
├──────────────────────────────────────┤
│ [Thumbnail image]                    │
│                                      │
│ DIFFICULTY: ⭐ Easy                 │
│ EQUIPMENT: Wall/pool edge            │
│                                      │
│ INSTRUCTIONS:                        │
│ "Start at wall, hold edge with one  │
│ hand. Lean back and practice body   │
│ position while maintaining wall     │
│ contact for safety and balance      │
│ control"                             │
│                                      │
│ DURATION: 5 minutes                  │
│                                      │
│ PROGRESSION:                         │
│ "Once comfortable, try using only   │
│ one hand on wall"                    │
│                                      │
│ [Button] "Add to Practice Session"  │
│ [Button] "Start This Drill Now"     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ▼ DRILL 2: Partner-Assisted Float   │
├──────────────────────────────────────┤
│ [Thumbnail]                          │
│ Duration: 5 minutes                  │
│ Difficulty: Easy                     │
│ Requires: Buddy/instructor           │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ▼ DRILL 3: Independent Back Float   │
├──────────────────────────────────────┤
│ [Thumbnail]                          │
│ Duration: 5-7 minutes                │
│ Difficulty: Moderate                 │
└──────────────────────────────────────┘
```

### Practice Routine Builder

```
[Practice Routine Builder]
[Button] "Create Custom Practice Session"

User taps button
    ↓
[Modal appears]
"Build Your Practice Routine"

Checklist:
☑️ Drill 1: Wall-Assisted (5 min)
☐ Drill 2: Partner-Assisted (5 min)
☑️ Drill 3: Independent Float (7 min)

Estimated total time: 12 minutes
Repetitions: [Dropdown] 1x, 2x, 3x
Rest between drills: [Dropdown] 30s, 60s, 90s

[Button] "Save & Start Practice"
[Button] "Save for Later"
```

---

## Common Mistakes & Corrections

```
[Section Header]
"⚠️ Watch Out For These"
"Common mistakes and how to fix them"

[Split Comparison Cards]

┌──────────────────────────────────────┐
│ MISTAKE 1: Head Position             │
├──────────────────────────────────────┤
│                                      │
│ ┌─────────┐         ┌─────────┐    │
│ │   ❌    │         │   ✅    │    │
│ │ WRONG   │         │ CORRECT │    │
│ └─────────┘         └─────────┘    │
│ [Image]             [Image]         │
│ Head tucked         Head back       │
│ Body sinking        Body horizontal │
│                                      │
│ PROBLEM:                             │
│ "Tucking chin causes hips to sink   │
│ and legs to drop"                    │
│                                      │
│ FIX:                                 │
│ "Keep head back, ears in water,     │
│ looking up at sky"                   │
│                                      │
│ [Video clip icon] "See comparison"  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ MISTAKE 2: Tense Body                │
├──────────────────────────────────────┤
│ ❌ WRONG           ✅ CORRECT        │
│ [Image]            [Image]           │
│ Stiff, tense       Relaxed floating  │
│                                      │
│ PROBLEM:                             │
│ "Tension causes you to sink faster. │
│ Muscles use more oxygen."            │
│                                      │
│ FIX:                                 │
│ "Relax your muscles. Your body is   │
│ naturally buoyant when relaxed."     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ MISTAKE 3: Holding Breath            │
├──────────────────────────────────────┤
│ ❌ WRONG           ✅ CORRECT        │
│ Breath held        Normal breathing  │
│                                      │
│ PROBLEM:                             │
│ "Holding breath creates tension     │
│ and panic"                           │
│                                      │
│ FIX:                                 │
│ "Breathe normally and rhythmically" │
└──────────────────────────────────────┘
```

### Interactive Quiz

```
[Interactive Quiz]
"❓ Test Your Knowledge"

Question: "What's the most common cause of sinking while back floating?"
Options:
○ Not kicking enough
○ Tucking chin to chest
○ Arms not moving
○ Water is too cold

User selects answer
    ↓
[Immediate Feedback]
✓ Correct! "Chin tuck changes body position and causes hips to sink"
[or]
✗ Incorrect. "The correct answer is: Tucking chin to chest..."
```

---

## Self-Assessment Checklist

```
[Section Header]
"Can You Do This?"
"Check off skills as you master them"

[Interactive Checklist]
Your Progress: 3 of 6 (50%)

☑️ I can assume back float position without assistance
☑️ I can maintain horizontal body position for 30+ seconds
☑️ I can breathe comfortably while floating
☐ I can recover to standing position safely
☐ I can float with minimal fear or tension
☐ I understand when to use back float (survival scenarios)

[Progress Ring]
50% Mastered
[Visual circular progress indicator]
```

**Behavior:**
- Tapping checkbox toggles completion
- Auto-saves progress
- When checklist 80%+ complete:
  - "🎉 You're almost there! Practice the remaining skills and mark complete when ready."

---

## DISCUSSION TAB

### Community Discussion Section

```
[Section Header]
"💬 Questions & Tips from Learners"
"23 comments"

[Sort Options]
[Most Recent] [Most Helpful] [Unanswered]

[Comment Thread]

┌────────────────────────────────────────┐
│ [Avatar] @SwimmerSarah                 │
│ 2 days ago                             │
│                                        │
│ "I keep getting water in my nose when │
│ floating on my back. Any tips?"       │
│                                        │
│ 💪 Helpful (12) | 💬 Reply (3)       │
│                                        │
│   ↳ [Avatar] @CoachMike ✓            │
│     1 day ago                          │
│     "Try humming or gently exhaling   │
│     through your nose. This prevents  │
│     water from entering. You can also │
│     use a nose clip initially."       │
│     💪 Helpful (8)                    │
│                                        │
│   ↳ [Avatar] @BeginnerBob             │
│     1 day ago                          │
│     "I had the same problem! The      │
│     humming trick worked for me."     │
│     💪 Helpful (5)                    │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ [Avatar] @TriathlonTina                │
│ 5 days ago                             │
│                                        │
│ "Pro tip: Imagine you're lying on a  │
│ bed. That mental cue helps me stay    │
│ relaxed and horizontal."              │
│                                        │
│ 💡 Helpful (18) | 💬 Reply (1)       │
└────────────────────────────────────────┘

[Load More Comments]

[Add Your Comment]
[Text input box]
"Share your experience or ask a question..."
[Post] button
```

**User Capabilities:**
- React to comments (helpful, encouraging)
- Reply to comments
- Flag inappropriate content
- Follow question for updates

---

## Related Content

```
[Section Header]
"You Might Also Like"

[Horizontal Scrollable Cards]

┌────────────────────────┐
│ [Thumbnail]            │
│ Floating on Front      │
│ Prerequisite lesson    │
│ ✓ Completed            │
│ [Review] button        │
└────────────────────────┘

┌────────────────────────┐
│ [Thumbnail]            │
│ Submerging & Breath    │
│ Control                │
│ Next lesson            │
│ 🔒 Complete this first │
└────────────────────────┘

┌────────────────────────┐
│ [Thumbnail]            │
│ Dryland: Core          │
│ Strengthening          │
│ Complementary workout  │
│ [Start] button         │
└────────────────────────┘

┌────────────────────────┐
│ [Thumbnail]            │
│ Overcoming Fear        │
│ of Water               │
│ Helpful article        │
│ [Read] button          │
└────────────────────────┘
```

---

## Bottom Action Bar (Sticky)

```
[Always visible at bottom]

Left side:
☐ Self-assessment: 50% complete

Right side buttons:
[⋮ More]
  Menu options:
  - Add to Favorites
  - Download for Offline
  - Share Lesson
  - Report Issue

[Practice Mode]
  Starts guided practice session

[Mark as Complete]
  Primary action button
```

**Button Status:**
- If checklist <80%: Button shows "50% Complete"
- If checklist ≥80%: Button enabled "Mark as Complete"

---

## User Interaction Flows

### PATH A: User watches video and marks complete

```
User watches full video (15:23)
    ↓
Scrolls through written instructions
    ↓
Checks off all self-assessment items
    ↓
Checklist reaches 100%
    ↓
"Mark as Complete" button becomes enabled and highlighted
    ↓
User taps "Mark as Complete"
    ↓
[Confirmation Modal]
"Complete this lesson?"
"Great work! Ready to move on?"
Buttons:
- "Yes, Mark Complete"
- "I Need More Practice"

User taps "Yes, Mark Complete"
    ↓
[Success Animation]
✓ Lesson marked complete
Confetti animation
+ 50 Points earned
Achievement badge if applicable

[Next Lesson Suggestion]
"Next Up: Submerging & Breath Control"
[Lesson preview card]
Buttons:
- "Start Next Lesson"
- "Return to Learn"
- "Start Practice Mode"
```

### PATH B: User adds drills to practice session

```
User expands Drill 1
    ↓
Taps "Add to Practice Session"
    ↓
[Toast notification]
"✓ Added to practice session"

User expands Drill 3
    ↓
Taps "Add to Practice Session"
    ↓
[Toast notification]
"✓ Added to practice session (2 drills)"

[Floating Action Button appears]
"Practice Session (2)"
    ↓
User taps floating button
    ↓
[Practice Session Preview]
"Your Custom Practice Session"
Duration: 12 minutes

Drills added:
1. Wall-Assisted Back Float (5 min)
2. Independent Back Float (7 min)

Buttons:
- "Start Practice Now"
- "Save for Later"
- "Edit Session"
```

### PATH C: User downloads for offline viewing

```
User taps "⋮ More" button
    ↓
Selects "Download for Offline"
    ↓
[Download Confirmation]
"Download Lesson?"
"Video size: 245 MB"
"Best on WiFi connection"
Includes: Video, instructions, images

Checkboxes:
☑️ Video (245 MB)
☑️ Written content (1 MB)
☐ Related drills (50 MB)

Buttons:
- "Download" (only enabled on WiFi or if user confirms)
- "Cancel"

User taps "Download"
    ↓
[Download Progress]
Progress bar shown in notification area
"Downloading Floating on Back... 45%"

When complete:
[Toast notification]
"✓ Lesson downloaded. Available offline."
```

### PATH D: User posts question to community

```
User scrolls to community section
    ↓
Taps "Add Your Comment" input
    ↓
[Comment Composer]
Text field expands
"Share your experience or ask a question..."
Character count: 0/500

User types:
"I'm having trouble keeping my legs from sinking. What am I doing wrong?"
    ↓
Taps [Post] button
    ↓
[Processing]
"Posting comment..."
    ↓
[Success]
✓ Comment posted
"Your comment has been posted!"

Comment appears at top of feed with "New" badge
+ 15 Points earned for community contribution

[Notification Settings]
"Get notified when someone replies?"
- "Yes, notify me"
- "No thanks"
```

### PATH E: User shares lesson with friend

```
Taps "⋮ More" > "Share Lesson"
    ↓
[Share Sheet]
"Share: Floating on Back"

Options:
- Copy Link
- Message
- Email
- Social Media (Facebook, Twitter, etc.)
- "Invite Friend to AquaCoach"

User selects "Message"
    ↓
System share dialog opens
Pre-filled message:
"Check out this swimming lesson on AquaCoach!
'Floating on Back'
[link]"

User sends message
    ↓
[Confirmation]
"✓ Lesson shared!"

If recipient doesn't have app:
They receive web link with app download prompt
```

---

## Technical Specifications

### Video Player
- Supports HLS streaming
- Adaptive bitrate based on connection
- Offline download with DRM protection
- Resume from last position across devices
- Analytics tracking for completion rates

### Progress Tracking
- Real-time sync across devices
- Granular tracking (per step, per drill)
- Auto-save every 5 seconds
- Offline progress queued for sync

### Performance
- Lazy load images below fold
- Preload next lesson in background
- Cache frequently accessed content
- Video thumbnail generation

### Accessibility
- Screen reader support for all content
- Closed captions for videos
- High contrast mode
- Keyboard navigation
- WCAG 2.1 AA compliant

### Analytics Events
- Lesson started
- Video played/paused
- Video completion percentage
- Step viewed
- Drill added to practice
- Assessment checkbox toggled
- Comment posted
- Lesson completed
- Time spent on page

---

## Design Tokens

### Typography
- Headings: System font, Bold, 20-32px
- Body: System font, Regular, 16px
- Captions: System font, Regular, 14px
- Buttons: System font, Semibold, 16px

### Colors
- Primary: #0066CC (AquaCoach Blue)
- Success: #00C853 (Green)
- Warning: #FFA000 (Amber)
- Error: #D32F2F (Red)
- Background: #FFFFFF
- Surface: #F5F5F5
- Text Primary: #212121
- Text Secondary: #757575

### Spacing
- Base unit: 8px
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

### Elevation
- Card: 2dp shadow
- Modal: 8dp shadow
- FAB: 6dp shadow

---

## Success Metrics

### Engagement
- Average time on lesson page
- Video completion rate
- Practice drill engagement
- Self-assessment completion rate
- Community participation

### Learning Outcomes
- Lesson completion rate
- Time to master skill
- User confidence ratings
- Skill retention (follow-up checks)

### User Satisfaction
- Lesson rating (1-5 stars)
- Net Promoter Score
- Support ticket volume
- User feedback sentiment

---

## Future Enhancements

### Phase 2
- Live coaching sessions
- AR overlay for body position feedback
- Peer practice matching
- Personalized practice plans
- Voice coaching during practice

### Phase 3
- Wearable device integration
- Underwater video analysis
- AI form correction
- Social challenges/competitions
- Certification programs

---

## In-Pool Practice Session Flow

### Practice Session Entry Point

```
User is ready to practice at pool
    ↓
Opens AquaCoach app
    ↓
[Dashboard]
    ↓
Taps "🏊 Start Pool Session" button
    ↓
```

---

## Practice Session Selector

```
[Session Type Selection Screen]
Header: "Choose Your Practice"

[Quick Start Options - Cards]

┌──────────────────────────────────┐
│ 🎯 RECOMMENDED FOR YOU           │
├──────────────────────────────────┤
│ Floating Skills Practice         │
│ Based on current lessons         │
│                                  │
│ Duration: 30 minutes             │
│ Focus: Back float, front float  │
│ Drills: 5 exercises              │
│ Difficulty: Beginner             │
│                                  │
│ [Start This Session]             │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ PRE-BUILT SESSIONS               │
├──────────────────────────────────┤
│                                  │
│ ▸ First Time in Pool (20 min)   │
│   Water confidence focus         │
│                                  │
│ ▸ Breathing Practice (25 min)   │
│   Breath control drills          │
│                                  │
│ ▸ Freestyle Fundamentals (30 min)│
│   Basic stroke work              │
│                                  │
│ [View All Pre-Built] →           │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ CUSTOM SESSION                   │
├──────────────────────────────────┤
│ Build your own practice session  │
│ [Create Custom Session]          │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ SAVED SESSIONS (2)               │
├──────────────────────────────────┤
│ ▸ My Float Routine (15 min)     │
│   Last used: 3 days ago          │
│                                  │
│ ▸ Weekend Workout (45 min)      │
│   Last used: 1 week ago          │
└──────────────────────────────────┘

[Bottom Options]
[Quick Challenge] - Random 15-min session
[Continue Last Session] - Resume previous
```

---

## Session Detail View

```
User taps "Start This Session" on recommended
    ↓
[Session Detail Screen]

Header: "Floating Skills Practice"
Duration: 30 minutes
Difficulty: Beginner

[Session Overview]
"This session reinforces your recent lessons on floating. Perfect for building confidence and muscle memory."

[Warm-up] (5 min)
- Water entry and adjustment
- Gentle movement
- Breathing exercises

[Main Practice] (20 min)
Drill 1: Wall-Assisted Back Float (5 min)
  - 5 reps × 30 seconds hold
  - Rest: 30 seconds between

Drill 2: Independent Back Float (5 min)
  - 5 reps × 1 minute hold
  - Rest: 30 seconds between

Drill 3: Front Float to Back Float (5 min)
  - 5 transitions
  - Focus on smooth transition

Drill 4: Float Recovery Practice (5 min)
  - Practice standing up from float
  - 8-10 repetitions

[Cool-down] (5 min)
- Gentle floating
- Relaxation
- Exit water safely

[Equipment Needed]
☐ None (optional: pool noodle for confidence)

[Pool Requirements]
☐ Access to shallow end (chest-deep water)
☐ Access to pool wall

[Session Options]
☑️ Audio coaching (recommended)
☐ Visual-only mode
Duration: [30 min] [Adjust ▼]

[Action Buttons]
[Customize Session] - Modify drills
[Start Session] - Begin now
```

---

## Pre-Session Setup

```
User taps "Start Session"
    ↓
[Pre-Session Checklist]
Header: "Before You Begin"

Safety Reminders:
☑️ I am not swimming alone (lifeguard or buddy present)
☑️ I know where emergency equipment is located
☑️ I have checked pool depth
☑️ I am feeling well (no dizziness, illness)

Equipment Check:
☑️ Goggles ready
☑️ Towel nearby
☑️ Water bottle available

Phone Setup:
☑️ Phone in waterproof case
☑️ Volume loud enough to hear
☑️ Placed securely at pool edge

[Enable Waterproof Mode?]
"Waterproof mode increases screen brightness, locks orientation, and simplifies controls for pool-side use."

Toggle: [ON] OFF

[Test Audio]
Button plays sample: "This is your audio coach. Can you hear me clearly?"

[Final reminder]
"⚠️ Never swim alone. Ensure lifeguard or buddy is present."

[Ready to Begin]
Large button: "I'm Ready - Start Session"

User taps button
    ↓
[Transition Screen]
"Get into position..."
"Enter the pool and move to shallow end"
Countdown: 10...9...8...7...6...5...4...3...2...1...

    ↓
SESSION BEGINS
```

---

## Active Practice Session - In-Pool Interface

**Waterproof mode: Activated**
- Screen: Maximum brightness
- Large touch targets
- Simplified interface

---

### WARM-UP PHASE (0:00 - 5:00)

```
[Screen Layout]

┌────────────────────────────────────┐
│ TOP BAR                            │
│ Session: 0:47 elapsed              │
│ [❚❚ Pause] [✕ End]                │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ CURRENT PHASE (Large text)         │
│                                    │
│     WARM-UP                        │
│                                    │
│  Water Entry & Adjustment          │
│                                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ Progress: 15% (0:47 of 5:00)       │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ CURRENT INSTRUCTION (Center)       │
│                                    │
│   Walk around shallow end          │
│   Splash water on face and arms    │
│   Get comfortable with temperature │
│                                    │
│   [Illustration: Person walking    │
│    in shallow water]               │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ TIME REMAINING (Large)             │
│                                    │
│        4:13                        │
│   remaining in warm-up             │
│                                    │
│ [Circular countdown ring]          │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ NEXT UP (Preview)                  │
│ Drill 1: Wall-Assisted Back Float  │
└────────────────────────────────────┘
```

**Audio Coaching - Automatically plays:**

🔊 Voice: "Welcome to your floating practice session. Let's start with a gentle warm-up. Walk around the shallow end, splash some water on your face and arms. Take your time getting comfortable. We have 5 minutes for warm-up."

At 2:30 (halfway):
🔊 Voice: "You're halfway through warm-up. How's the water temperature? Keep moving gently. In a couple minutes we'll start our first drill."

At 4:45 (15 seconds warning):
🔊 Voice: "Warm-up almost complete. Get ready for your first drill: Wall-Assisted Back Float. Move to the pool wall now."

At 5:00:
[Automatic transition]

---

### DRILL 1: Wall-Assisted Back Float (5:00 - 10:00)

```
[Screen Updates]

┌────────────────────────────────────┐
│ TOP BAR                            │
│ Session: 5:12 elapsed              │
│ [❚❚ Pause] [✕ End]                │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ CURRENT DRILL                      │
│                                    │
│  DRILL 1 of 4                      │
│  Wall-Assisted Back Float          │
│                                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ Drill Progress: 5% (0:12 of 5:00)  │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ CURRENT ACTION (Very Large Text)   │
│                                    │
│         SWIM                       │
│     Hold: 30 seconds               │
│                                    │
│ Rep 1 of 5                         │
│                                    │
│ [Visual: Back float illustration]  │
│                                    │
│ Form Focus: Keep head back         │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ INTERVAL TIMER (Huge, Prominent)   │
│                                    │
│         0:18                       │
│                                    │
│ [Circular countdown: Green]        │
│  ●●●●●●●●●●●●●●●●●●○○○○○○○○      │
│                                    │
│ Time remaining in hold              │
└────────────────────────────────────┘
```

**Audio Coaching:**

At start of drill:
🔊 "Drill 1: Wall-Assisted Back Float. Hold the wall with both hands. Lean back gently and float for 30 seconds. Focus on keeping your head back. Let's begin!"

During hold (at 15 seconds):
🔊 "Halfway there. Keep that head back, belly button up. You're doing great!"

Final countdown (last 5 seconds):
🔊 "5...4...3...2...1...and rest!"

**Screen Changes to REST:**

```
┌────────────────────────────────────┐
│ CURRENT ACTION                     │
│                                    │
│         REST                       │
│    30 seconds recovery             │
│                                    │
│ Rep 1 complete ✓                   │
│ 4 more to go                       │
│                                    │
│ [Visual: Relaxing figure]          │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ REST TIMER                         │
│                                    │
│         0:22                       │
│                                    │
│ [Circular countdown: Blue]         │
│                                    │
│ Breathe and recover                │
└────────────────────────────────────┘
```

**Audio Coaching:**
🔊 "Great work! Rest for 30 seconds. Breathe normally and shake out your arms. Next rep starts soon."

At 10 seconds remaining:
🔊 "10 seconds of rest left. Get ready for rep 2."

At 3 seconds:
🔊 "And...3...2...1...go!"

**Cycle repeats for 5 reps:**
- Rep 2: SWIM 30s → REST 30s
- Rep 3: SWIM 30s → REST 30s
- Rep 4: SWIM 30s → REST 30s
- Rep 5: SWIM 30s → REST 30s

After final rep:
🔊 "Excellent! Drill 1 complete. Take a moment to catch your breath. Next up: Independent Back Float."

[30-second transition period]

```
[Screen Shows]
┌────────────────────────────────────┐
│ DRILL COMPLETE ✓                   │
│                                    │
│ Wall-Assisted Back Float           │
│ 5 of 5 reps completed              │
│                                    │
│ + 25 Points                        │
│                                    │
│ Next: Drill 2 in 0:18              │
└────────────────────────────────────┘
```

---

### DRILL 2: Independent Back Float (10:00 - 15:00)

**Similar interface structure**

🔊 "Drill 2: Independent Back Float. This time, no wall support. Float for 1 full minute. Remember everything you practiced. If you need to rest, grab the wall. Ready? Let's go!"

**Interface shows:**
- SWIM: 1:00 duration
- Rep 1 of 5
- Large countdown timer
- Form reminders rotating:
  * "Head back"
  * "Relax"
  * "Breathe normally"

[Continues through 5 reps with REST periods]

---

### DRILLS 3 & 4

[Follow same pattern with appropriate durations and instructions]

---

### COOL-DOWN PHASE (25:00 - 30:00)

```
[Screen]
┌────────────────────────────────────┐
│     COOL-DOWN                      │
│  Gentle floating and relaxation    │
│                                    │
│  5:00 remaining                    │
└────────────────────────────────────┘
```

🔊 "Excellent work today! Time to cool down. Float gently, breathe deeply, and relax. You've earned it!"

At 1:00 remaining:
🔊 "One more minute. When we're done, exit the water slowly and safely. Great job today!"

At 0:00:
[Session Complete]

---

## Session Completion

```
[Session Complete Screen]

┌────────────────────────────────────┐
│          🎉 GREAT JOB!            │
│                                    │
│   Session Complete                 │
│   30:00 total time                 │
│                                    │
│   [Success animation]              │
└────────────────────────────────────┘

[Session Summary]
Drills Completed: 4 of 4 ✓
Reps Completed: 20 of 20
Time in Water: 30 minutes
Calories Burned: ~120 kcal (estimate)

[Points Earned]
+ 100 Points
+ Streak Bonus: +20 (3 days in a row)
Total: 120 Points

[Achievements]
🏆 Float Master - Complete 5 floating drills
🔥 3-Day Streak - Practice 3 days in a row

[Personal Best]
⭐ New record: Most drills in single session!

[Quick Stats]
This Week: 3 sessions
This Month: 12 sessions
Total: 45 sessions

[Action Buttons]
[View Detailed Stats]
[Share Progress]
[Schedule Next Session]
[Done]
```

---

## Post-Session Actions

```
User taps "View Detailed Stats"
    ↓

[Detailed Session Analytics]

Performance Breakdown:
- Warm-up: 5:00 ✓
- Drill 1: 5:00 ✓ (5/5 reps)
- Drill 2: 5:00 ✓ (5/5 reps)
- Drill 3: 5:00 ✓ (5/5 transitions)
- Drill 4: 5:00 ✓ (8 recoveries)
- Cool-down: 5:00 ✓

Heart Rate: Not tracked
(Connect wearable to track)

Consistency:
▓▓▓▓▓▓▓ Mon-Sun
Last 4 weeks: 85% attendance

Progress Over Time:
[Graph showing session completion]

[Export Data]
[Share Screenshot]
```

---

## In-Session Controls

### Pause Menu

```
User taps [❚❚ Pause] during session
    ↓

[Overlay appears]
Session Paused
Timer stopped at: 12:34

Options:
- [▶️ Resume] - Continue session
- [Skip Drill] - Move to next drill
- [Add Time] - Extend rest period
- [Adjust Audio] - Volume control
- [End Session] - Finish early

Emergency:
- [Emergency Exit] - Safety protocol
```

### Emergency Exit Protocol

```
User taps [Emergency Exit]
    ↓

[Warning Screen]
⚠️ Are you sure?

"Only use this if you need to exit the pool immediately for safety reasons."

Buttons:
- [I'm Safe - Just Tired]
  → Ends session normally, saves progress

- [Emergency Situation]
  → Immediate exit, no save
  → Displays emergency contacts
  → Optional: Send location to emergency contact

- [Cancel] - Return to pause menu
```

---

## Adaptive Features

### Difficulty Adjustment

```
If user struggles with drill:

[Mid-Session Prompt]
"Having trouble with this drill?"

Options:
- "Yes, it's too hard"
  → Reduces reps or duration
  → Offers easier variation

- "No, I'm fine"
  → Continues as planned

- "Skip this drill"
  → Moves to next drill
  → Marks for review
```

### Real-Time Coaching Tips

```
During rest periods:

[Coaching Cards rotate]
💡 Tip: "Keep your core engaged"
💡 Tip: "Look straight up, not forward"
💡 Tip: "Relax your shoulders"

[Optional: Video snippet]
"Quick form check" (10-second clip)
```

---

## Technical Requirements

### Waterproof Mode Specifications
- Screen brightness: 100%
- Touch sensitivity: Increased for wet fingers
- Orientation lock: Portrait
- Screen timeout: Disabled
- Notification banner: Minimized
- Button size: Minimum 60x60px
- Font size: Minimum 18pt for readability

### Audio Engineering
- Voice coaching: Clear, encouraging tone
- Background music: Optional, low volume
- Countdown beeps: Distinct, audible over pool noise
- Volume auto-adjust: Compensate for ambient noise
- Waterproof speaker recommended

### Battery Management
- Session duration estimate: 30 min = ~5% battery
- Low battery warning at 15%
- Auto-save every 30 seconds
- Offline mode: All content pre-downloaded

### Offline Support
- Sessions downloadable in advance
- Audio coaching cached locally
- Progress syncs when online
- No internet required during session

---

## Safety Features

### Safety Checks

**Pre-Session:**
- Mandatory buddy/lifeguard confirmation
- Pool depth verification
- Equipment check
- Health status check

**During Session:**
- Pause reminder every 10 minutes
- "Are you okay?" prompt if no interaction for 2 minutes
- Emergency exit always accessible
- Volume check every 5 minutes

**Post-Session:**
- Hydration reminder
- Exit water safely reminder
- Equipment cleanup checklist

### Emergency Protocols

```
[Emergency Contact Setup]
(Configured in settings)

Primary Contact: [Name] [Phone]
Secondary Contact: [Name] [Phone]

Emergency Features:
☑️ One-tap call to contact
☑️ Send location via SMS
☑️ Display pool address
☑️ Show nearest emergency exit

[Pool Information]
Name: [Pool Name]
Address: [Address]
Emergency Phone: [Pool Office]
AED Location: [Description]
```

---

## Gamification Elements

### Session Challenges

```
[Optional Challenges]
(Presented before session)

Today's Challenge:
"🎯 Perfect Form Focus"
Complete all reps with form reminders checked
Reward: +50 bonus points

Weekly Challenge:
"🔥 5-Session Week"
Practice 5 times this week
Reward: Badge + 200 points

Community Challenge:
"🌊 Global Swim Week"
Join 10,000+ swimmers worldwide
Reward: Exclusive achievement
```

### Streaks & Consistency

```
[Streak Tracker]
Current Streak: 🔥 3 days
Longest Streak: 🏆 14 days

Streak Rewards:
- 3 days: +10 bonus points per session
- 7 days: +25 bonus points per session
- 14 days: +50 bonus points + badge
- 30 days: +100 bonus points + special badge

[Consistency Score]
This Week: 85% ⭐⭐⭐⭐
This Month: 75% ⭐⭐⭐

(Based on recommended 3-4 sessions/week)
```

### Social Features

```
[Optional Sharing]
After session completion:

Share Your Achievement:
"Just completed a 30-minute floating practice! 🏊"

[Generated Image]
- Session stats
- Points earned
- Streak info
- Motivational quote

Share to:
- AquaCoach Community
- Facebook
- Instagram
- Twitter
- Private message

[Privacy Options]
☑️ Share stats only (no location)
☐ Include pool location
☐ Tag friends
```

---

## Practice Session Analytics

### Session History

```
[Practice History Screen]

This Week: 3 sessions, 90 minutes
Last 7 Days: 4 sessions, 120 minutes
This Month: 12 sessions, 360 minutes

[Calendar View]
S  M  T  W  T  F  S
   ✓     ✓  ✓
✓        ✓  ✓
      ✓

[Session List]
┌────────────────────────────────┐
│ Today - Floating Skills        │
│ 30 min • 100 pts • 4/4 drills │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 2 days ago - Breathing Practice│
│ 25 min • 80 pts • 3/3 drills  │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 4 days ago - Float Routine     │
│ 15 min • 50 pts • 2/2 drills  │
└────────────────────────────────┘

[View All →]
```

### Progress Tracking

```
[Skill Progress Dashboard]

Floating Skills: ████████░░ 80%
- Back Float: ██████████ 100% ✓
- Front Float: ████████░░ 85%
- Side Float: ████░░░░░░ 40%

Breathing: ██████░░░░ 60%
- Rhythmic Breathing: ████████░░ 75%
- Underwater: ████░░░░░░ 45%

Stroke Technique: ████░░░░░░ 35%
- Freestyle: ████░░░░░░ 40%
- Backstroke: ██░░░░░░░░ 20%

[Detailed Breakdown →]
```

---

## Session Customization

### Session Builder

```
[Create Custom Session]

Session Name: [Text input]
"My Morning Routine"

Duration: [Slider]
◉───────────── 15 min
    30 min
    45 min
    60 min

[Add Drills]
Search drills or browse categories:

☑️ Wall-Assisted Back Float (5 min)
   Reps: [5] Duration: [30s] Rest: [30s]

☑️ Breathing Exercise (3 min)
   Reps: [10] Duration: [15s] Rest: [15s]

☐ Freestyle Stroke Practice (10 min)
   [Add to session]

[Drag to reorder]

Warm-up: [Auto] [Custom] [None]
Cool-down: [Auto] [Custom] [None]

[Preview Session]
[Save Session]
```

### Audio Preferences

```
[Audio Settings]

Coaching Voice:
○ Sarah (Encouraging, Female)
○ Mike (Motivational, Male)
● Alex (Neutral, Calm)

Coaching Frequency:
○ Minimal (Start/end only)
● Standard (Key moments)
○ Detailed (Frequent tips)

Background Music:
Toggle: ON [OFF]
Volume: ◉─────────── 30%

Countdown Beeps:
Toggle: [ON] OFF
○ Beep only
● Beep + Voice

Form Reminders:
Toggle: [ON] OFF
Frequency: Every [2] reps
```

---

## Accessibility Features

### Visual Accommodations
- High contrast mode
- Large text option (up to 24pt)
- Color blind friendly indicators
- Haptic feedback for timers
- Reduced motion option

### Audio Accommodations
- Adjustable voice speed (0.5x - 2x)
- Text-to-speech for all instructions
- Visual-only mode (no audio required)
- Closed captions for coaching
- Custom alert tones

### Physical Accommodations
- One-handed mode
- Voice commands (start/pause/skip)
- Extended touch targets
- Simplified interface option
- Auto-advance mode (no taps required)

---

## Future Enhancements - Practice Mode

### Phase 2
- Real-time form feedback via phone camera
- Heart rate zone tracking
- Lap counter integration
- Pool depth auto-detection via sensors
- Multi-user sessions (group workouts)

### Phase 3
- Underwater audio via bone conduction
- AR form overlay
- AI coach with computer vision
- Smart watch integration
- Competition mode (race against others)
- Virtual coach video calls during session