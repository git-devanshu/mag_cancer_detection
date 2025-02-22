const recommendations = {
    benign: {
      lowConfidence: `
        1. Self-Monitoring & Skin Examination:
        - Regular self-checks using the ABCDE rule.
        - Use a mirror or smartphone for tracking.
  
        2. Sun Protection & Prevention:
        - Apply SPF 30+ sunscreen.
        - Avoid peak sun hours (10 AM – 4 PM).
  
        3. Healthy Skin Practices:
        - Stay hydrated, eat a balanced diet, avoid smoking.
      `,
      highConfidence: `
        1. Self-Monitoring & Skin Examination:
        - Same as low confidence, but monitor more frequently.
        - Consider dermatologist evaluation if concerns arise.
      `
    },
    malignant: {
      lowConfidence: `
        1. Dermatologist Consultation:
        - Book an appointment within 2-4 weeks.
        - Track changes using ABCDE rule.
        
        2. Sun Protection:
        - Apply SPF 50+ and wear protective clothing.
  
        3. When to Seek Urgent Care:
        - If the lesion grows, bleeds, or causes pain, consult a doctor immediately.
      `,
      highConfidence: `
        1. Immediate Medical Consultation:
        - Book an appointment within 1-2 days.
        - The doctor may perform a biopsy to confirm malignancy.
        
        2. Urgent Self-Care:
        - Avoid scratching, picking, or applying chemicals.
        
        3. Sun Protection:
        - Strictly avoid prolonged sun exposure.
        
        4. Psychological & Emotional Support:
        - Seek professional medical guidance and support groups.
      `
    }
  };
  
  module.exports = recommendations;
  