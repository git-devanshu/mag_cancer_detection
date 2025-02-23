const recommendations = {
  benign: {
    lowConfidence:
      "1. Self-Monitoring & Skin Examination:\n" +
      "- Regular self-checks using the ABCDE rule.\n" +
      "- Use a mirror or smartphone for tracking.\n\n" +
      "2. Sun Protection & Prevention:\n" +
      "- Apply SPF 30+ sunscreen.\n" +
      "- Avoid peak sun hours (10 AM – 4 PM).\n\n" +
      "3. Healthy Skin Practices:\n" +
      "- Stay hydrated, eat a balanced diet, avoid smoking.\n",

    highConfidence:
      "1. Self-Monitoring & Skin Examination:\n" +
      "- Regular self-checks using the ABCDE rule.\n" +
      "- Use a mirror or smartphone for tracking.\n\n" +
      "2. Sun Protection & Prevention:\n" +
      "- Apply SPF 30+ sunscreen.\n" +
      "- Avoid peak sun hours (10 AM – 4 PM).\n\n" +
      "3. Healthy Skin Practices:\n" +
      "- Stay hydrated, eat a balanced diet, avoid smoking.\n",
  },

  malignant: {
    lowConfidence:
      "1. Dermatologist Consultation:\n" +
      "- Book an appointment within 2-4 weeks.\n" +
      "- Track changes using ABCDE rule.\n\n" +
      "2. Sun Protection:\n" +
      "- Apply SPF 50+ and wear protective clothing.\n\n" +
      "3. When to Seek Urgent Care:\n" +
      "- If the lesion grows, bleeds, or causes pain, consult a doctor immediately.\n",

    highConfidence:
      "1. Immediate Medical Consultation:\n" +
      "- Book an appointment within 1-2 days.\n" +
      "- The doctor may perform a biopsy to confirm malignancy.\n\n" +
      "2. Urgent Self-Care:\n" +
      "- Avoid scratching, picking, or applying chemicals.\n\n" +
      "3. Sun Protection:\n" +
      "- Strictly avoid prolonged sun exposure.\n",
  },
};

module.exports = recommendations;
