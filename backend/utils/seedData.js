require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Note = require('../models/Note');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const StudyTask = require('../models/StudyTask');
const Document = require('../models/Document');
const UserProgress = require('../models/UserProgress');
const ChatHistory = require('../models/ChatHistory');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_study_db';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB for seeding...');

    // Clear existing demo user if exists
    const existingDemoUser = await User.findOne({ email: 'alex@studyai.edu' });
    if (existingDemoUser) {
      await Promise.all([
        Note.deleteMany({ user: existingDemoUser._id }),
        Quiz.deleteMany({ user: existingDemoUser._id }),
        QuizAttempt.deleteMany({ user: existingDemoUser._id }),
        StudyTask.deleteMany({ user: existingDemoUser._id }),
        Document.deleteMany({ user: existingDemoUser._id }),
        UserProgress.deleteMany({ user: existingDemoUser._id }),
        ChatHistory.deleteMany({ user: existingDemoUser._id }),
        User.deleteOne({ _id: existingDemoUser._id }),
      ]);
      console.log('[Seed] Cleared existing demo user data.');
    }

    // Create Demo User
    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: 'alex@studyai.edu',
      password: 'password123',
      bio: 'Junior CS student specializing in Artificial Intelligence and Distributed Systems. Preparing for semester finals!',
      gradeLevel: 'College / Undergraduate',
      major: 'Computer Science & AI',
      institution: 'Stanford School of Engineering',
      learningPreferences: {
        dailyGoalMinutes: 90,
        preferredSubject: 'Data Structures & Algorithms',
        difficultyLevel: 'Intermediate',
        darkMode: false,
        emailNotifications: true,
      },
    });

    console.log('[Seed] Created demo user: alex@studyai.edu / password123');

    // Create Sample Notes
    const sampleNotes = [
      {
        user: demoUser._id,
        title: 'Mastery Notes: Balanced Binary Search Trees (AVL & Red-Black)',
        subject: 'Data Structures & Algorithms',
        topic: 'Binary Search Trees & Balancing',
        summary: 'Balanced search trees guarantee O(log n) time complexity for search, insertion, and deletion by performing rotational rebalancing whenever node heights violate tree invariants.',
        keyPoints: [
          'AVL Trees strictly enforce balance factor of {-1, 0, +1} via single (LL, RR) or double (LR, RL) rotations.',
          'Red-Black Trees allow slightly deeper trees but require fewer rotations during frequent insertions and deletions.',
          'Crucial search property: left child < parent < right child must be preserved after every rotation.',
          'Standard real-world use: C++ std::map, Java TreeMap, and Linux kernel memory management.',
        ],
        detailedExplanation: `### Tree Rebalancing Mechanics\n\nWhen a node insertion violates height invariants:\n1. Identify the deepest unbalanced ancestor.\n2. Determine the insertion path relative to ancestor (Left-Left, Left-Right, Right-Right, Right-Left).\n3. Apply corresponding pointer mutations in O(1) time.\n\nAll tree operations preserve strictly logarithmic runtime: **O(log n)**.`,
        practicalExamples: [
          'Inserting sorted data 1, 2, 3, 4, 5 into an ordinary BST creates an O(n) degenerate linked list. AVL turns this into height 3.',
        ],
        tags: ['dsa', 'trees', 'algorithms', 'exam-prep'],
        isPinned: true,
        color: 'blue',
      },
      {
        user: demoUser._id,
        title: 'Core Concepts: Neural Network Backpropagation & Gradient Descent',
        subject: 'Machine Learning',
        topic: 'Backpropagation and Optimization',
        summary: 'Backpropagation applies the multivariate calculus chain rule backward from the loss function to compute partial derivatives of loss with respect to all layer weights.',
        keyPoints: [
          'Forward pass computes activations and final loss comparing prediction to ground truth.',
          'Backward pass calculates gradients dL/dW through recursive chain rule.',
          'Optimizer (SGD, Adam, RMSProp) updates weights: W = W - alpha * dL/dW.',
          'Vanishing gradient problem occurs in deep networks using Sigmoid/Tanh, mitigated by ReLU and Residual Connections.',
        ],
        detailedExplanation: `### The Chain Rule in Deep Learning\n\nFor a 2-layer network:\n$$ dL/dW_1 = dL/da_2 * da_2/dz_2 * dz_2/da_1 * da_1/dz_1 * dz_1/dW_1 $$\n\nModern autograd frameworks maintain a computational directed acyclic graph (DAG) to execute this automatically.`,
        practicalExamples: [
          'Training a handwritten digit classifier (MNIST) where 784 input pixels map to 10 class logits.',
        ],
        tags: ['machine-learning', 'deep-learning', 'math'],
        isPinned: true,
        color: 'purple',
      },
      {
        user: demoUser._id,
        title: 'System Architecture: ACID Properties & Database Isolation Levels',
        subject: 'Database Management Systems',
        topic: 'Transactions & Concurrency',
        summary: 'ACID guarantees that database transactions are processed reliably. Isolation levels trade concurrency performance against consistency anomalies.',
        keyPoints: [
          'Atomicity: All operations in a transaction succeed or all rollback (WAL journal).',
          'Consistency: Transitions database from one valid state to another satisfying constraints.',
          'Isolation: Concurrent transactions execute without cross-contamination.',
          'Durability: Committed data survives hardware failure and power loss.',
          'Isolation Levels: Read Uncommitted < Read Committed < Repeatable Read < Serializable.',
        ],
        detailedExplanation: `### Concurrency Phenomena\n- **Dirty Read:** Reading uncommitted mutations from another transaction.\n- **Non-Repeatable Read:** Re-reading the same row returns modified data.\n- **Phantom Read:** Re-executing a range query returns newly inserted rows.`,
        practicalExamples: [
          'Bank money transfer: Debiting account A and crediting account B must be Atomic. If system crashes midway, rollback occurs.',
        ],
        tags: ['databases', 'acid', 'sql', 'backend'],
        isPinned: false,
        color: 'emerald',
      },
    ];

    await Note.insertMany(sampleNotes);
    console.log('[Seed] Inserted sample notes.');

    // Create Sample Quizzes
    const sampleQuiz = await Quiz.create({
      user: demoUser._id,
      title: 'Data Structures: Tree & Graph Algorithms Mastery',
      subject: 'Data Structures & Algorithms',
      topic: 'Trees, Graphs, and Pathfinding',
      difficulty: 'Medium',
      questions: [
        {
          questionText: 'What is the worst-case time complexity of searching for an element in an AVL tree with n nodes?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswerIndex: 1,
          explanation: 'AVL trees strictly maintain a height difference of at most 1, guaranteeing that height is always O(log n). Therefore, search takes O(log n) worst-case.',
        },
        {
          questionText: 'Which graph traversal algorithm uses a First-In-First-Out (FIFO) queue data structure?',
          options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Dijkstra Algorithm with Min-Heap', 'Kruskal Algorithm'],
          correctAnswerIndex: 0,
          explanation: 'BFS explores nodes level by level using a FIFO queue, whereas DFS uses a LIFO call stack or explicit stack.',
        },
        {
          questionText: 'Which property is guaranteed in a Min-Heap binary tree?',
          options: [
            'Every parent node is greater than or equal to its children',
            'Every parent node is less than or equal to its children',
            'Left child is strictly less than right child',
            'All leaf nodes have identical values',
          ],
          correctAnswerIndex: 1,
          explanation: 'In a Min-Heap, the root element holds the minimum value and every parent node is less than or equal to its children.',
        },
        {
          questionText: 'What is the time complexity of Dijkstra algorithm using an adjacency list and binary min-heap?',
          options: ['O(V^2)', 'O(E + V log V)', 'O((V + E) log V)', 'O(V * E)'],
          correctAnswerIndex: 2,
          explanation: 'With an adjacency list and a binary min-heap, Dijkstra runs in O((V + E) log V) time.',
        },
        {
          questionText: 'What is a topological sort of a directed graph?',
          options: [
            'A linear ordering of vertices such that for every directed edge u -> v, u comes before v',
            'A sorted list of vertices by degree',
            'A shortest path tree from source node',
            'A minimum spanning forest',
          ],
          correctAnswerIndex: 0,
          explanation: 'Topological sorting exists only for Directed Acyclic Graphs (DAGs) and orders vertices linearly respecting dependency order.',
        },
      ],
      totalQuestions: 5,
    });

    console.log('[Seed] Inserted sample quiz.');

    // Create Sample Quiz Attempt
    await QuizAttempt.create({
      user: demoUser._id,
      quiz: sampleQuiz._id,
      quizTitle: sampleQuiz.title,
      subject: sampleQuiz.subject,
      userAnswers: [
        { questionIndex: 0, questionText: sampleQuiz.questions[0].questionText, selectedOption: 1, correctOption: 1, isCorrect: true, explanation: sampleQuiz.questions[0].explanation },
        { questionIndex: 1, questionText: sampleQuiz.questions[1].questionText, selectedOption: 0, correctOption: 0, isCorrect: true, explanation: sampleQuiz.questions[1].explanation },
        { questionIndex: 2, questionText: sampleQuiz.questions[2].questionText, selectedOption: 1, correctOption: 1, isCorrect: true, explanation: sampleQuiz.questions[2].explanation },
        { questionIndex: 3, questionText: sampleQuiz.questions[3].questionText, selectedOption: 2, correctOption: 2, isCorrect: true, explanation: sampleQuiz.questions[3].explanation },
        { questionIndex: 4, questionText: sampleQuiz.questions[4].questionText, selectedOption: 0, correctOption: 0, isCorrect: true, explanation: sampleQuiz.questions[4].explanation },
      ],
      score: 5,
      totalQuestions: 5,
      percentage: 100,
      timeSpentSeconds: 145,
    });

    // Create Sample Study Tasks (Study Planner)
    const now = new Date();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const sampleTasks = [
      {
        user: demoUser._id,
        title: 'Review Dynamic Programming Memoization vs Tabulation',
        subject: 'Data Structures & Algorithms',
        description: 'Solve 3 LeetCode medium problems on Knapsack and Longest Common Subsequence.',
        targetDate: now,
        estimatedMinutes: 60,
        priority: 'high',
        status: 'completed',
        completedAt: now,
      },
      {
        user: demoUser._id,
        title: 'Study Operating System Deadlock Conditions & Bankers Algorithm',
        subject: 'Operating Systems',
        description: 'Read Chapter 7 on Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.',
        targetDate: tomorrow,
        estimatedMinutes: 45,
        priority: 'medium',
        status: 'pending',
      },
      {
        user: demoUser._id,
        title: 'Complete Database Normalization (1NF to BCNF) Practice Set',
        subject: 'Database Management Systems',
        description: 'Practice decomposing relations to eliminate insertion, deletion, and update anomalies.',
        targetDate: dayAfter,
        estimatedMinutes: 50,
        priority: 'high',
        status: 'in-progress',
      },
      {
        user: demoUser._id,
        title: 'Review TCP Three-Way Handshake and Flow Control Windows',
        subject: 'Computer Networks',
        description: 'Diagram SYN, SYN-ACK, ACK sequence and sliding window acknowledgment.',
        targetDate: new Date(Date.now() + 72 * 60 * 60 * 1000),
        estimatedMinutes: 40,
        priority: 'low',
        status: 'pending',
      },
    ];

    await StudyTask.insertMany(sampleTasks);
    console.log('[Seed] Inserted sample study tasks.');

    // Create Sample Document Analysis
    await Document.create({
      user: demoUser._id,
      originalName: 'Operating_Systems_Virtual_Memory_Lecture.txt',
      fileName: 'doc-sample-vm.txt',
      filePath: 'uploads/doc-sample-vm.txt',
      fileSize: 45200,
      fileType: 'txt',
      subject: 'Operating Systems',
      extractedText: 'Virtual memory decouples logical address spaces from physical RAM using hardware page tables, translation lookaside buffers (TLB), and paging algorithms...',
      summary: 'Comprehensive overview of Virtual Memory, Page Fault handling, and Page Replacement Algorithms (LRU, Optimal, FIFO). Discusses hardware MMU translation, dirty bits, and thrashing prevention.',
      keyTakeaways: [
        'Page tables map virtual page numbers (VPN) to physical frame numbers (PFN).',
        'Translation Lookaside Buffer (TLB) provides an ultra-fast hardware cache for address translations.',
        'Page fault triggers an OS kernel interrupt to fetch missing pages from disk backing store.',
        'Thrashing occurs when the working set exceeds physical RAM, causing the system to spend all time paging.',
      ],
      qaPairs: [
        {
          question: 'What is the role of the TLB in virtual memory?',
          answer: 'The TLB acts as a high-speed hardware cache that stores recent VPN-to-PFN translations, avoiding multiple RAM lookups for page tables.',
        },
        {
          question: 'How does an operating system recover from a page fault?',
          answer: 'The CPU traps to the kernel, the OS locates the requested page on secondary storage, finds an available RAM frame (evicting one via LRU if necessary), loads the data, updates the page table, and restarts the instruction.',
        },
      ],
    });

    // Create User Progress
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const sampleWeekly = days.map((day, idx) => ({
      day,
      date: new Date(Date.now() - (6 - idx) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      minutes: [60, 90, 45, 120, 80, 50, 75][idx],
      tasksCompleted: [2, 3, 1, 4, 2, 1, 3][idx],
    }));

    await UserProgress.create({
      user: demoUser._id,
      totalStudyMinutes: 520,
      completedTopicsCount: 14,
      quizzesTaken: 6,
      averageQuizScore: 92,
      streakDays: 6,
      weeklyActivity: sampleWeekly,
      subjectProgress: [
        { subject: 'Data Structures & Algorithms', minutesSpent: 210, notesCount: 5, quizzesCount: 3, completionPercent: 82 },
        { subject: 'Operating Systems', minutesSpent: 130, notesCount: 3, quizzesCount: 1, completionPercent: 60 },
        { subject: 'Machine Learning', minutesSpent: 90, notesCount: 3, quizzesCount: 1, completionPercent: 50 },
        { subject: 'Database Management Systems', minutesSpent: 90, notesCount: 3, quizzesCount: 1, completionPercent: 55 },
      ],
      recentActivities: [
        {
          activityType: 'quiz',
          title: 'Aced DSA Mastery Practice Quiz',
          details: 'Scored 5/5 (100%) on Trees and Graph Algorithms',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
          activityType: 'task',
          title: 'Completed Goal: Dynamic Programming Review',
          details: 'Subject: Data Structures & Algorithms (60 mins)',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          activityType: 'note',
          title: 'Generated Notes: Balanced Binary Trees',
          details: 'Subject: Data Structures & Algorithms',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
      ],
    });

    // Create Sample Chat Session
    await ChatHistory.create({
      user: demoUser._id,
      title: 'Dijkstra vs A* Algorithm Comparison',
      subject: 'Data Structures & Algorithms',
      messages: [
        {
          sender: 'user',
          content: 'What is the main difference between Dijkstra algorithm and A* search?',
          subject: 'Data Structures & Algorithms',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
        },
        {
          sender: 'assistant',
          content: 'The core difference lies in how they prioritize node exploration:\n\n1. **Dijkstra\'s Algorithm:** Explores uniformly in all directions based purely on actual cost from start `g(n)`.\n2. **A* Search:** Guided search that combines actual cost `g(n)` with a heuristic estimate `h(n)` to the goal: `f(n) = g(n) + h(n)`.\n\nWhen `h(n)` is admissible (never overestimates true cost), A* is guaranteed to find the optimal shortest path while examining significantly fewer states than Dijkstra!',
          subject: 'Data Structures & Algorithms',
          conceptBreakdown: [
            'Dijkstra explores equal-cost contours radially.',
            'A* bends the search space toward target destination using heuristic distance.',
            'Admissibility and consistency ensure optimality.',
          ],
          examples: [
            'GPS Navigation: Dijkstra searches all roads equally in circle, while A* with Euclidean distance heuristic heads toward destination city.',
          ],
          timestamp: new Date(Date.now() - 19 * 60 * 1000),
        },
      ],
    });

    console.log('[Seed] Demo database populated successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
