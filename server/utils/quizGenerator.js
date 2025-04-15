exports.generateQuizQuestions = async (content) => {
    // Simple static generation for demo
    return [
      {
        question: 'What is the main topic of this news?',
        options: ['Politics', 'Sports', 'Technology', 'Other'],
        correctAnswer: 'Other',
      },
      {
        question: 'Who is mentioned in this article?',
        options: ['Leader', 'Athlete', 'Scientist', 'None'],
        correctAnswer: 'None',
      },
    ];
  };