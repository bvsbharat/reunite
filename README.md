# Reunite.ai - AI-Powered Missing Person Identification & Recovery

Reunite.ai is a futuristic forensic tool designed to help families and authorities find missing persons by reconstructing their current appearance using advanced AI reasoning. Unlike traditional age progression, which applies linear aging, Reunite.ai utilizes Google's Gemini 3.0 to simulate how specific life scenarios (e.g., homelessness, captivity, off-grid living) physically alter a person's appearance over years of absence.

## 🚨 The Problem

Every day, thousands of people go missing. As time passes, their appearance changes drastically, not just due to biological aging, but due to environmental factors, lifestyle changes, and health conditions.

*   **Linear Aging is Insufficient:** Traditional forensic tools apply standard aging filters that assume a healthy, standard lifestyle. They fail to account for the physical toll of rough sleeping, untreated health issues, or high-stress environments.
*   **Lack of Visual Context:** Families often struggle to envision what their loved one might look like *now* if they have been living on the streets or in captivity for years.
*   **Identification Gap:** Without accurate, scenario-based visuals, the public often fails to recognize missing persons even when they see them, leading to missed opportunities for recovery.

## 💡 The Solution: Deep Thinking & Forensic Reasoning

Reunite.ai solves this by treating identity reconstruction as a **multi-scenario reasoning problem**, not just an image filter task.

### How It Works

1.  **Data Ingestion**: The system accepts an old reference photo along with critical data: Age when lost, Years missing, and Last known location.
2.  **Deep Reasoning (Gemini 3 Pro)**:
    *   The "Deep Thinking" engine analyzes the input to determine probable life scenarios.
    *   It calculates biological aging based on gender and time elapsed.
    *   It infers environmental weathering (e.g., "If subject is homeless in a sunny coastal city -> increased UV damage, weathered skin, unkempt hair").
    *   It generates a detailed "Forensic Profile" describing these physical changes in text.
3.  **Visual Reconstruction (Gemini 3 Image)**:
    *   The system translates the Forensic Profile into high-fidelity, photorealistic images.
    *   It produces distinct variations (e.g., "Scenario A: Rough Sleeper" vs "Scenario B: Shelter Resident") to maximize the probability of identification.

### Key Features

*   **Scenario-Based Simulation**: Generates profiles for scenarios like Homelessness, Human Trafficking, Memory Loss, and Voluntary Disappearance.
*   **Forensic Accuracy**: Accounts for weight changes, grooming habits (or lack thereof), sun exposure, and stress markers.
*   **Reasoning-First Approach**: Provides a text-based "Thought Process" explaining *why* the image looks that way (e.g., "Subject appears gaunt due to likely nutritional deficits associated with the specific scenario").
*   **Privacy & Security**: All processing is handled securely, intended for legitimate identification purposes.

## 🛠 Tech Stack

*   **AI Core**: Google Gemini 3.0 Pro (Reasoning) & Gemini 3.0 Image (Generation)
*   **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
*   **Design**: Cyber-Forensic UI/UX with dark mode support.

## Use Case Example

> **Subject:** John Doe, lost at age 25, missing for 10 years.
>
> **Traditional Tool:** Shows a healthy 35-year-old in a polo shirt.
>
> **Reunite.ai:**
> *   *Variation 1 (Homeless):* Shows a 35-year-old with weathered skin, beard, layered clothing, and signs of exposure.
> *   *Variation 2 (Recovered/Sheltered):* Shows a 35-year-old with modest grooming but signs of premature aging.
>
> **Result:** A passerby recognizes Variation 1 as a regular at a local soup kitchen, leading to a successful tip.