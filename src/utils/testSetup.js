// Helpers partagés par les écrans de configuration de test.

export const parseQuestionCount = (value) => (value ? parseInt(value, 10) : null);

export const isQuestionCountValid = (value) => !!value && parseInt(value, 10) > 0;
