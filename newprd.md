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
