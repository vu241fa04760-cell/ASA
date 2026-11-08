/**
 * YouTube Curated Resource Helper for Backend AI Services
 */

const SUBJECT_YOUTUBE_MAP = {
  'data structures & algorithms': {
    url: 'https://www.youtube.com/watch?v=RBSGKlAnoiM',
    title: 'Data Structures and Algorithms Full Course for Beginners',
    channel: 'freeCodeCamp.org',
  },
  'operating systems': {
    url: 'https://www.youtube.com/watch?v=26QPDBe-NB8',
    title: 'Introduction to Operating Systems (Complete University Series)',
    channel: 'Neso Academy',
  },
  'database management systems': {
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    title: 'SQL & Relational Database Design Full Course',
    channel: 'freeCodeCamp.org',
  },
  'machine learning & ai': {
    url: 'https://www.youtube.com/watch?v=aircAruvnKk',
    title: 'Neural Networks & Deep Learning Visual Intuition',
    channel: '3Blue1Brown',
  },
  'computer networks': {
    url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8',
    title: 'Computer Networking Complete Course (OSI, TCP/IP, DNS)',
    channel: 'NetworkChuck',
  },
  'mathematics & calculus': {
    url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    title: 'The Essence of Calculus (Full Visual Guide)',
    channel: '3Blue1Brown',
  },
  'physics': {
    url: 'https://www.youtube.com/watch?v=7uV8h5-s2sU',
    title: 'Classical Mechanics & Core Physics Masterclass',
    channel: 'MIT OpenCourseWare (Walter Lewin)',
  },
  'chemistry': {
    url: 'https://www.youtube.com/watch?v=FSyAehMdpyI',
    title: 'General Chemistry - Atomic Structure & Periodic Table',
    channel: 'CrashCourse',
  },
  'biology': {
    url: 'https://www.youtube.com/watch?v=QnQe0xW_JY4',
    title: 'Introduction to Biology: Cellular Mechanics & Genetics',
    channel: 'CrashCourse',
  },
  'general study': {
    url: 'https://www.youtube.com/watch?v=ukLnPbIffxE',
    title: 'How to Study & Learn Faster (Evidence-Based Revision Techniques)',
    channel: 'Ali Abdaal',
  },
};

const getSubjectYouTube = (subject, topic = '') => {
  const key = (subject || '').trim().toLowerCase();
  const matched = SUBJECT_YOUTUBE_MAP[key] || {
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + ' course tutorial')}`,
    title: `${subject} Masterclass Lecture`,
    channel: 'YouTube Learning',
  };

  const topicSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + ' ' + (topic || '') + ' tutorial lecture')}`;

  return {
    primaryVideo: matched,
    topicSearchUrl,
    suggestedVideos: [
      {
        title: topic ? `${topic} - In-Depth Walkthrough & Explanation` : matched.title,
        url: topic ? topicSearchUrl : matched.url,
        channel: topic ? 'Recommended YouTube Tutorial' : matched.channel,
        isSearch: Boolean(topic),
      },
      {
        title: `${subject} Complete Foundation Course`,
        url: matched.url,
        channel: matched.channel,
        isSearch: false,
      },
    ],
  };
};

module.exports = {
  SUBJECT_YOUTUBE_MAP,
  getSubjectYouTube,
};
