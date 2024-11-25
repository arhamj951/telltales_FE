type Author = {
  name: string;
  avatar: string;
};

type Article = {
  tag: string;
  title: string;
  description: string;
  authors: Author[];
};

var articleInfo: Article[] = [
  {
    tag: "Technology",
    title: "Exploring the next frontier of quantum computing",
    description:
      "Quantum computing is poised to revolutionize industries. In this article, we explore the potential applications of quantum computing and how it will shape the future of technology.",
    authors: [{ name: "Alice Green", avatar: "/static/images/avatar/1.jpg" }],
  },
  {
    tag: "Innovation",
    title: "How AI is transforming the healthcare industry",
    description:
      "AI is playing an increasingly important role in healthcare. Learn how machine learning, predictive analytics, and data-driven insights are improving patient outcomes and revolutionizing healthcare practices.",
    authors: [{ name: "Sarah Lee", avatar: "/static/images/avatar/3.jpg" }],
  },
  {
    tag: "Finance",
    title: "Blockchain technology: The future of financial transactions",
    description:
      "Blockchain is reshaping the world of finance by enabling secure and transparent transactions. In this article, we delve into the various use cases of blockchain in banking and beyond.",
    authors: [{ name: "David King", avatar: "/static/images/avatar/4.jpg" }],
  },
  {
    tag: "Marketing",
    title: "Building an effective digital marketing strategy",
    description:
      "Digital marketing is an essential component of business success. This article discusses strategies for building an effective digital marketing plan that drives engagement, conversion, and long-term growth.",
    authors: [{ name: "Emily Roberts", avatar: "/static/images/avatar/5.jpg" }],
  },
  {
    tag: "Leadership",
    title: "The importance of emotional intelligence in leadership",
    description:
      "Emotional intelligence is a key factor in successful leadership. This article explores how leaders can develop emotional intelligence and create a positive organizational culture.",
    authors: [
      { name: "Jessica Taylor", avatar: "/static/images/avatar/7.jpg" },
    ],
  },
  {
    tag: "Design",
    title: "Creating user-centric interfaces: Tips for UI designers",
    description:
      "User-centered design is at the heart of great digital experiences. In this article, we share valuable tips for UI designers to create intuitive and engaging interfaces that put users first.",
    authors: [{ name: "Olivia Brown", avatar: "/static/images/avatar/8.jpg" }],
  },
  {
    tag: "Sustainability",
    title: "The rise of renewable energy: A sustainable future",
    description:
      "Renewable energy sources are becoming increasingly important in the fight against climate change. This article explores the role of wind, solar, and other renewable energy sources in creating a sustainable future.",
    authors: [{ name: "Sophia Clark", avatar: "/static/images/avatar/10.jpg" }],
  },
  {
    tag: "Artificial Intelligence",
    title: "AI in cybersecurity: Protecting against emerging threats",
    description:
      "AI is revolutionizing cybersecurity by helping organizations detect and respond to emerging threats in real-time. This article covers the latest advancements in AI-driven cybersecurity tools.",
    authors: [{ name: "Liam Harris", avatar: "/static/images/avatar/11.jpg" }],
  },
  {
    tag: "Entrepreneurship",
    title: "How to build a successful startup from the ground up",
    description:
      "Building a startup is no easy task. In this article, we discuss the essential steps for aspiring entrepreneurs to take in order to build a successful and sustainable business.",
    authors: [{ name: "Daniel Lee", avatar: "/static/images/avatar/12.jpg" }],
  },
  {
    tag: "Culture",
    title: "The role of corporate culture in organizational success",
    description:
      "Corporate culture plays a crucial role in employee satisfaction and organizational success. This article examines how companies can build a strong culture that fosters collaboration, innovation, and growth.",
    authors: [{ name: "Rachel Moore", avatar: "/static/images/avatar/13.jpg" }],
  },
];

export default articleInfo;
