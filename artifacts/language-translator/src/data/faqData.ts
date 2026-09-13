export type FaqItem = {
  id: string;
  topic: string;
  question: string;
  answer: string;
};

export const faqTopic = 'AI Learning & Student Support';

export const faqItems: FaqItem[] = [
  {
    id: 'start-course',
    topic: 'Courses',
    question: 'How do I choose and start a course?',
    answer:
      'Choose a course that matches your current goal and experience level, review its learning outcomes, and begin with the first module. Set a regular weekly study schedule so you can make steady progress instead of trying to finish everything in one sitting.',
  },
  {
    id: 'beginner-friendly',
    topic: 'Beginner questions',
    question: 'Can I learn AI and machine learning if I am a complete beginner?',
    answer:
      'Yes. Start with basic programming and data concepts, then move through introductory machine learning lessons. You do not need advanced mathematics on day one; learn the required concepts gradually while practicing with small, understandable examples.',
  },
  {
    id: 'ai-ml-path',
    topic: 'AI and ML learning',
    question: 'What is a good learning path for AI and machine learning?',
    answer:
      'A practical path is Python fundamentals, data handling with tools such as NumPy and pandas, statistics basics, supervised and unsupervised learning, model evaluation, and small projects. After that, explore deep learning or a specialization that matches your interests.',
  },
  {
    id: 'learning-resources',
    topic: 'Learning resources',
    question: 'Where can I find reliable learning resources?',
    answer:
      'Use the course lessons first, then supplement them with official documentation, well-maintained tutorials, research explainers, and practice datasets. Compare explanations from more than one trusted source and write down what you learned instead of only watching videos.',
  },
  {
    id: 'assignment-help',
    topic: 'Assignments',
    question: 'What should I do when I do not understand an assignment?',
    answer:
      'Read the requirements again, split the task into smaller deliverables, and write down the exact part that is unclear. Try a small example, check the relevant lesson or documentation, and ask a focused question that includes what you tried and the result you received.',
  },
  {
    id: 'assignment-quality',
    topic: 'Assignments',
    question: 'How can I improve the quality of my assignments?',
    answer:
      'Explain your approach, keep your code organized, test normal and edge cases, and include a short conclusion about what the result means. Review the requirements before submitting and remove copied or unexplained work that you cannot confidently discuss.',
  },
  {
    id: 'deadlines',
    topic: 'Deadlines',
    question: 'How should I manage course and assignment deadlines?',
    answer:
      'Record every deadline in a calendar, estimate the work needed, and start with the task that has the longest lead time. Break large assignments into milestones and leave time for testing, revisions, and unexpected technical issues.',
  },
  {
    id: 'late-work',
    topic: 'Deadlines',
    question: 'What should I do if I might miss a deadline?',
    answer:
      'Submit the strongest complete portion you can, document what remains, and contact the course or internship coordinator as early as possible. Do not wait until after the deadline to explain a problem, especially when a technical issue is involved.',
  },
  {
    id: 'project-expectations',
    topic: 'Projects',
    question: 'What makes a good student AI project?',
    answer:
      'A good project solves a clearly stated problem, has a focused scope, explains the data and method, and demonstrates a working result. Include limitations and possible improvements; honest evaluation is more useful than claiming that a small prototype is production-ready.',
  },
  {
    id: 'submit-project',
    topic: 'Submitting projects',
    question: 'How should I submit, upload, or turn in a completed project?',
    answer:
      'Include the source code, a clear README, setup instructions, screenshots or a short demonstration when useful, and notes about the main design decisions. Test the project from a clean environment and make sure another person can understand how to run it.',
  },
  {
    id: 'github',
    topic: 'GitHub',
    question: 'Why should I use GitHub for my learning projects?',
    answer:
      'GitHub keeps your code and history organized, makes collaboration easier, and gives you a link you can share with mentors or employers. Use a descriptive README, meaningful commits, and a repository structure that helps someone review the project quickly.',
  },
  {
    id: 'github-readme',
    topic: 'GitHub',
    question: 'What should a project README contain?',
    answer:
      'Describe the problem, features, technology choices, installation steps, run commands, usage instructions, and known limitations. If the project uses an external service, document what it does and whether a key or account is required without publishing any credentials.',
  },
  {
    id: 'internship',
    topic: 'Internships',
    question: 'How can I get the most from an internship?',
    answer:
      'Treat each task as a chance to learn a complete workflow: understand the requirement, plan small steps, build incrementally, test the result, and document what you did. Ask for feedback early and keep a record of the skills and outcomes you can discuss later.',
  },
  {
    id: 'certificates',
    topic: 'Certificates',
    question: 'When do I receive a course or internship certificate?',
    answer:
      'Certificate requirements depend on the program. Usually you must complete the required lessons or tasks, meet submission rules, and finish any review process. Check the official program instructions because a certificate should reflect verified completion rather than simply registering.',
  },
  {
    id: 'attendance',
    topic: 'Participation',
    question: 'Does attendance or participation matter in online learning?',
    answer:
      'Yes. Consistent participation helps you keep pace, ask questions while context is fresh, and receive feedback before small problems grow. If you cannot attend a live session, review the materials and complete the associated activity when the program allows it.',
  },
  {
    id: 'technical-support',
    topic: 'Technical support',
    question: 'What information should I include when asking for technical support?',
    answer:
      'Share the goal, the exact error message, the command or steps that caused it, your environment, and what you already tried. Include a small relevant code sample or screenshot, but remove passwords, API keys, tokens, and other private information first.',
  },
  {
    id: 'stuck-debugging',
    topic: 'Technical support',
    question: 'How can I debug a problem when I feel stuck?',
    answer:
      'Reproduce the smallest failing case, read the full error message, and change one thing at a time. Add temporary logging or use a debugger to check your assumptions, then search the official documentation using the exact error text and compare the result with your code.',
  },
  {
    id: 'practice',
    topic: 'Practice',
    question: 'How do I practice AI skills outside the lessons?',
    answer:
      'Recreate a small example without copying it, change one variable, and explain the result in your own words. Public datasets, coding exercises, model evaluation experiments, and small automation tools are useful because they turn concepts into repeatable practice.',
  },
  {
    id: 'portfolio',
    topic: 'Portfolio',
    question: 'How do I turn learning projects into a strong portfolio or resume project collection?',
    answer:
      'Choose a few projects that show different skills and polish them rather than listing every experiment. For each one, explain the problem, your contribution, technical choices, result, and what you would improve. Link to a working demo or repository whenever possible.',
  },
  {
    id: 'career-preparation',
    topic: 'Career preparation',
    question: 'How should I prepare for an AI or software career?',
    answer:
      'Build fundamentals, practice explaining your projects, solve problems regularly, and learn to read documentation independently. Prepare a concise portfolio, resume, and project stories that show how you handled tradeoffs, debugging, collaboration, and measurable outcomes.',
  },
  {
    id: 'feedback',
    topic: 'Feedback',
    question: 'How should I use feedback on my project?',
    answer:
      'Separate feedback into correctness, usability, code quality, and presentation. Fix issues that affect the user or requirements first, ask follow-up questions when feedback is unclear, and keep a short record of what changed and why.',
  },
];