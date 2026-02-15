'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 文章数据
const articles = [
  {
    id: 1,
    title: "Letter to Millie",
    difficulty: "easy",
    content: "Thanks for your letter. I study at Hope Middle School. Our school is small. We only have a few classrooms. We do not have a library, but we have a reading room. Sometimes we read books there. Our playground is in front of the classrooms. It is not very big. We often play there after school. Our teachers are all very kind. We like them very much. I live far away from the school. I go to school on foot every day. It takes me about an hour to get to school.",
    newWords: [
      {word: "classrooms", phonetic: "/ˈklɑːsruːmz/", meaning: "教室"},
      {word: "library", phonetic: "/ˈlaɪbrəri/", meaning: "图书馆"},
      {word: "playground", phonetic: "/ˈpleɪɡraʊnd/", meaning: "操场"},
      {word: "teachers", phonetic: "/ˈtiːtʃəz/", meaning: "老师"}
    ]
  },
  {
    id: 2,
    title: "Halloween",
    difficulty: "easy",
    content: "Halloween is on October 31. How do we celebrate it? Children have lots of fun on that day. We dress up and wear masks. Sometimes we paint our faces. We also make pumpkin lanterns. It is interesting. When the evening comes, we visit houses and play a game with the people inside. We knock on their doors and shout \"trick or treat\". Usually they give us some candy as a treat. If they do not give us a treat, we play a trick on them. We always have a party on the evening of October 31 and enjoy nice food and drinks. It is really a special day.",
    newWords: [
      {word: "celebrate", phonetic: "/ˈselɪbreɪt/", meaning: "庆祝"},
      {word: "masks", phonetic: "/mɑːsks/", meaning: "面具"},
      {word: "pumpkin", phonetic: "/ˈpʌmpkɪn/", meaning: "南瓜"},
      {word: "lanterns", phonetic: "/ˈlæntənz/", meaning: "灯笼"},
      {word: "trick", phonetic: "/trɪk/", meaning: "恶作剧"}
    ]
  },
  {
    id: 3,
    title: "Kitty and Daniel",
    difficulty: "easy",
    content: "Hi! My name is Kitty. I love dancing. I dance for half an hour every day. Healthy food is important for me. I need to keep fit. I always have milk and bread for breakfast. For lunch and dinner, I usually eat fish and vegetables. Sometimes I feel hungry between meals, so I eat an apple or a pear. I seldom eat cakes or sweets. They have too much sugar and are bad for my teeth. Hello! I am Daniel. I like playing computer games. I seldom exercise. I love hamburgers and cola, but they are not healthy.",
    newWords: [
      {word: "dancing", phonetic: "/ˈdɑːnsɪŋ/", meaning: "跳舞"},
      {word: "healthy", phonetic: "/ˈhelθi/", meaning: "健康的"},
      {word: "vegetables", phonetic: "/ˈvedʒtəblz/", meaning: "蔬菜"},
      {word: "seldom", phonetic: "/ˈseldəm/", meaning: "很少"},
      {word: "exercise", phonetic: "/ˈeksəsaɪz/", meaning: "锻炼"}
    ]
  },
  {
    id: 4,
    title: "Fashion Show",
    difficulty: "medium",
    content: "Good evening, ladies and gentlemen. Welcome to our fashion show. I am Millie from Class 1, Grade 7. Today we are going to show you different styles of clothes. Look at me. I am wearing sports clothes and a pair of trainers. Trainers are light and comfortable and are popular among young people. Here comes Simon. He is wearing a purple shirt and a pair of grey trousers. His red and grey tie matches his clothes. He looks smart. Now Amy and Daniel are coming. They look cool! Amy is wearing a yellow cotton blouse and a blue scarf. Daniel is wearing a blue shirt.",
    newWords: [
      {word: "fashion", phonetic: "/ˈfæʃn/", meaning: "时尚"},
      {word: "trainers", phonetic: "/ˈtreɪnəz/", meaning: "运动鞋"},
      {word: "comfortable", phonetic: "/ˈkʌmftəbl/", meaning: "舒适的"},
      {word: "trousers", phonetic: "/ˈtraʊzəz/", meaning: "裤子"},
      {word: "cotton", phonetic: "/ˈkɒtn/", meaning: "棉的"}
    ]
  },
  {
    id: 5,
    title: "Zoo Guide",
    difficulty: "easy",
    content: "Hi, everybody. Here we're in front of the South Gate. Go straight on, and you'll find the Panda House. Pandas are cute. They like to eat bamboo and lie down all day long. Every year, lots of visitors come here to see them. Walk along the road. To the north of the Panda House, you'll find the lions. Lions are the kings of the animal world. Remember that they're dangerous. Never go near them. Turn left, and to the west of the Lions' Area, you'll find the World of Birds. Birds make beautiful sounds when they sing. To the north of the World of Birds is the Monkeys' Forest.",
    newWords: [
      {word: "visitors", phonetic: "/ˈvɪzɪtəz/", meaning: "游客"},
      {word: "dangerous", phonetic: "/ˈdeɪndʒərəs/", meaning: "危险的"},
      {word: "bamboo", phonetic: "/bæmˈbuː/", meaning: "竹子"}
    ]
  },
  {
    id: 6,
    title: "Sunshine Park",
    difficulty: "medium",
    content: "One Sunday morning, Millie and Amy went to Sunshine Park. As usual, they sat down under a big tree. Suddenly, they heard a whisper from the bushes behind the tree. They turned around but saw nothing. \"Is anybody there?\" Millie asked. Nobody replied. \"That's strange,\" the two girls were very afraid. They left the park quickly. On their way home, they met Andy. \"What happened?\" Andy asked. \"There's a 'ghost' in the park!\" Millie said. Then she told Andy everything. \"What is it?\" Andy wondered. He went to the park, stood beside the tree and listened carefully. Then he heard the whisper! He searched the bushes.",
    newWords: [
      {word: "whisper", phonetic: "/ˈwɪspə/", meaning: "低语"},
      {word: "bushes", phonetic: "/ˈbʊʃɪz/", meaning: "灌木丛"},
      {word: "replied", phonetic: "/rɪˈplaɪd/", meaning: "回答"},
      {word: "wondered", phonetic: "/ˈwʌndəd/", meaning: "想知道"}
    ]
  },
  {
    id: 7,
    title: "Alice in Wonderland",
    difficulty: "medium",
    content: "Alice opened the bottle and drank a little. It tasted sweet. Alice liked it. She drank some more. Then she felt a little ill. She looked down and saw that her body became smaller and smaller. Soon Alice was small enough to go through the door, so she decided to enter the garden. When she walked towards the door, she forgot about the key. Alice had to go back to the table, but she was too small to reach the key. She tried to climb up, but failed. Then she saw a piece of cake under the table. A note on the box said \"EAT ME\".",
    newWords: [
      {word: "tasted", phonetic: "/ˈteɪstɪd/", meaning: "尝起来"},
      {word: "decided", phonetic: "/dɪˈsaɪdɪd/", meaning: "决定"},
      {word: "towards", phonetic: "/təˈwɔːdz/", meaning: "朝向"}
    ]
  },
  {
    id: 8,
    title: "Woodland School",
    difficulty: "medium",
    content: "My name is Nancy. I am in Year 8 at Woodland School near London. It is a mixed school. Boys and girls have lessons together. Among all my subjects, I like French best. Learning foreign languages is fun. Our school has a Reading Week every year. During the week, we can borrow more books from the school library. We can also bring in books and magazines from home. I often read more books than my classmates. Near the end of the week, we discuss the books with our classmates in class. Time seems to go faster when we are reading interesting books.",
    newWords: [
      {word: "subjects", phonetic: "/ˈsʌbdʒɪkts/", meaning: "科目"},
      {word: "foreign", phonetic: "/ˈfɒrən/", meaning: "外国的"},
      {word: "magazines", phonetic: "/ˌmæɡəˈziːnz/", meaning: "杂志"},
      {word: "discuss", phonetic: "/dɪˈskʌs/", meaning: "讨论"}
    ]
  },
  {
    id: 9,
    title: "Xi Wang the Panda",
    difficulty: "medium",
    content: "I first saw the baby panda when she was only ten days old. We called her Xi Wang. This means \"hope\". When Xi Wang was born, she weighed just 100 grams and looked like a white mouse. At four months old, she weighed about eight kilograms and started to go outside for the first time. Eight months later, she was not a small baby any more and weighed over 35 kilograms. In the beginning, Xi Wang drank her mother's milk. When she was six months old, she began to eat bamboo. When she was 20 months old, she learnt to look after herself.",
    newWords: [
      {word: "weighed", phonetic: "/weɪd/", meaning: "重量为"},
      {word: "kilograms", phonetic: "/ˈkɪləɡræmz/", meaning: "千克"},
      {word: "bamboo", phonetic: "/bæmˈbuː/", meaning: "竹子"}
    ]
  },
  {
    id: 10,
    title: "Zhalong Nature Reserve",
    difficulty: "hard",
    content: "Many birds live in Zhalong all year round, while some go there only for a short stay. Most birds are active in the daytime, so you can easily watch them there. There are not many types of cranes left in the world, but 40 per cent of those types live in Zhalong. Some people want to make the wetlands smaller in order to have more space for farms and buildings. This will lead to less and less space for wildlife. Moreover, fishermen keep fishing there. As a result, the birds do not have enough food to eat. Now the Chinese government has made laws to prevent all these things in Zhalong.",
    newWords: [
      {word: "wetlands", phonetic: "/ˈwetlændz/", meaning: "湿地"},
      {word: "wildlife", phonetic: "/ˈwaɪldlaɪf/", meaning: "野生动物"},
      {word: "fishermen", phonetic: "/ˈfɪʃəmən/", meaning: "渔民"},
      {word: "prevent", phonetic: "/prɪˈvent/", meaning: "阻止"}
    ]
  },
  {
    id: 11,
    title: "Around the World in Eight Hours",
    difficulty: "medium",
    content: "Welcome to \"Around the World in Eight Hours\". I'm your tour guide, Robin. Have you noticed the \"Tour\" icon at the top of the page? Just click on it, and you can visit Asia, Africa, Europe, America and more in only eight hours! Here we are in \"the Big Apple\"—New York, the biggest city in the USA. Wall Street, the world-famous trade centre, is here at the southern end of Manhattan Island. There are many big companies and international banks here. Further on is Times Square. Every year, thousands of people gather here on New Year's Eve. It's exciting to see the huge glass ball falling through the darkness!",
    newWords: [
      {word: "icon", phonetic: "/ˈaɪkɒn/", meaning: "图标"},
      {word: "Manhattan", phonetic: "/mænˈhætən/", meaning: "曼哈顿"},
      {word: "international", phonetic: "/ˌɪntəˈnæʃnəl/", meaning: "国际的"}
    ]
  },
  {
    id: 12,
    title: "Gulliver's Travels",
    difficulty: "hard",
    content: "After our ship crashed against the rocks, I swam as far as I could. By the time I finally felt the land under my feet, I was tired out. I fell down on the beach and went to sleep. I woke up as the sun was rising, but I found I could not move. My arms, legs and hair were tied to the ground! Then I felt something on my leg. It moved up over my stomach and neck until it was standing near my face. I looked down and saw a very small man. He was the same size as my little finger! Where was I? Who was this tiny person?",
    newWords: [
      {word: "crashed", phonetic: "/kræʃt/", meaning: "碰撞"},
      {word: "stomach", phonetic: "/ˈstʌmək/", meaning: "胃"},
      {word: "tiny", phonetic: "/ˈtaɪni/", meaning: "微小的"}
    ]
  },
  {
    id: 13,
    title: "Special Olympics",
    difficulty: "hard",
    content: "Liu Ming did not know what to expect when he volunteered for the Special Olympics World Summer Games in Shanghai, back in October 2007. Now he thinks it was the most amazing experience of his life. \"It's fantastic to work as a volunteer!\" he said. The Special Olympics World Games give children and adults with intellectual disabilities a chance to show their skills to the world. They include many events similar to those in the Olympics, such as basketball, football and swimming. Over 40,000 people gave up their spare time for the 2007 Special Olympics World Games. It was necessary for these volunteers to receive training before doing their tasks.",
    newWords: [
      {word: "volunteered", phonetic: "/ˌvɒlənˈtɪəd/", meaning: "志愿做"},
      {word: "intellectual", phonetic: "/ˌɪntəˈlektʃuəl/", meaning: "智力的"},
      {word: "disabilities", phonetic: "/ˌdɪsəˈbɪlətiz/", meaning: "残疾"},
      {word: "necessary", phonetic: "/ˈnesəsəri/", meaning: "必要的"}
    ]
  },
  {
    id: 14,
    title: "ORBIS Nurse",
    difficulty: "hard",
    content: "Diana was once a secretary of a big company. She lived in a comfortable flat and drove to work. She travelled to many places, but she seldom took the plane. She was afraid of flying. One day, Diana saw a TV programme about ORBIS. She learnt about the Flying Eye Hospital. She wanted to help poor people with eye problems see again, so she made up her mind to train as a nurse and attended courses after work. Diana is working for ORBIS now. She has to travel over 300 days a year. She is getting used to travelling by plane. Diana enjoys her work. She is glad to be able to help people see again. She does not have as much money as before, but she thinks her life is more meaningful.",
    newWords: [
      {word: "secretary", phonetic: "/ˈsekrətri/", meaning: "秘书"},
      {word: "comfortable", phonetic: "/ˈkʌmftəbl/", meaning: "舒适的"},
      {word: "meaningful", phonetic: "/ˈmiːnɪŋfl/", meaning: "有意义的"}
    ]
  },
  {
    id: 15,
    title: "Recycling in Switzerland",
    difficulty: "hard",
    content: "I love Switzerland. It is a country with high mountains and clean blue lakes. It is beautiful, and we should try to keep it that way. In Switzerland, things like glass, plastic and paper are separated into different groups and then recycled. Even old clothes and shoes can be recycled. I learnt about an organization for recycling clothes. It collects old clothes from all over the country. Some of the clothes are sold in charity shops, some are given to the poor, and others are sent to factories for recycling. My family and I often send our old jeans and T-shirts to this organization.",
    newWords: [
      {word: "recycled", phonetic: "/ˌriːˈsaɪkld/", meaning: "回收"},
      {word: "organization", phonetic: "/ˌɔːɡənaɪˈzeɪʃn/", meaning: "组织"},
      {word: "charity", phonetic: "/ˈtʃærəti/", meaning: "慈善"}
    ]
  },
  {
    id: 16,
    title: "Colours and Moods",
    difficulty: "hard",
    content: "Some people believe that colours can influence our moods. You may wonder whether it is true. In fact, colours can change our moods and make us feel happy or sad, energetic or sleepy. This article explains what colours can do and what characteristics they represent. Calm colours: Have you ever walked into a room and felt relaxed? It could be because the walls were painted blue. Blue is a calm colour. It brings peace to our mind and body. Blue can also represent sadness, so you may say \"I'm feeling blue\" when you are feeling sad. White is another calm colour. It is also the colour of purity.",
    newWords: [
      {word: "influence", phonetic: "/ˈɪnfluəns/", meaning: "影响"},
      {word: "energetic", phonetic: "/ˌenəˈdʒetɪk/", meaning: "精力充沛的"},
      {word: "represent", phonetic: "/ˌreprɪˈzent/", meaning: "代表"},
      {word: "purity", phonetic: "/ˈpjʊərəti/", meaning: "纯洁"}
    ]
  },
  {
    id: 17,
    title: "Spud Webb",
    difficulty: "hard",
    content: "Although he was a great player at university, the NBA was not interested in him because all its players were more than 20cm taller than he was. After he graduated, he was forced to play in another basketball league. He remained there for about a year before the NBA took notice of him. In 1985, he joined the Atlanta Hawks and became the shortest player in the NBA at that time. He had many great achievements, but his proudest moment came in 1986—he won the Slam Dunk Contest. Through hard work, Spud Webb proved that size and body type do not matter—you can do almost anything if you never give up!",
    newWords: [
      {word: "graduated", phonetic: "/ˈɡrædʒueɪtɪd/", meaning: "毕业"},
      {word: "achievements", phonetic: "/əˈtʃiːvmənts/", meaning: "成就"},
      {word: "proved", phonetic: "/pruːvd/", meaning: "证明"}
    ]
  },
  {
    id: 18,
    title: "Tan Dun",
    difficulty: "hard",
    content: "Each time a medal was presented to a winner at the Beijing 2008 Olympic Games, the award music was played. The music was written by Tan Dun, a world-famous composer. Born in 1958 in central Hunan, China, Tan Dun grew up near the Liuyang River. When he was very young, Tan showed an interest in music. He loves the sounds of the rushing water and the blowing wind because, to him, the best music comes from nature. Since he had no musical instruments then, he made music with common objects like stones and paper.",
    newWords: [
      {word: "composer", phonetic: "/kəmˈpəʊzə/", meaning: "作曲家"},
      {word: "instruments", phonetic: "/ˈɪnstrəmənts/", meaning: "乐器"}
    ]
  },
  {
    id: 19,
    title: "Audrey Hepburn",
    difficulty: "hard",
    content: "Hepburn was born in Belgium on 4 May 1929. As a child, she loved dancing and dreamt of becoming a successful ballet dancer. After World War II, she moved to London with her mother. She worked as a model before becoming an actress. In 1951, while acting in France, Hepburn met the French writer Colette. Hepburn's beauty and charm caught the writer's attention. Colette insisted that Hepburn was the perfect girl for the lead role in Gigi, a play based upon her novel, although Hepburn had never played any major roles before. That event marked the beginning of her successful career.",
    newWords: [
      {word: "dreamt", phonetic: "/dremt/", meaning: "梦想"},
      {word: "ballet", phonetic: "/ˈbæleɪ/", meaning: "芭蕾"},
      {word: "insisted", phonetic: "/ɪnˈsɪstɪd/", meaning: "坚持"}
    ]
  },
  {
    id: 20,
    title: "Murder Mystery",
    difficulty: "hard",
    content: "Early today, the body of a 25-year-old man was found in West Town. The police have confirmed that the victim was a computer engineer. He was last seen leaving his office in East Town at about 7 p.m. yesterday. He said he was going to visit his parents. The police believe that the murder took place between 9 p.m. last night and 1 a.m. this morning. They are still working at the scene of the crime to find out whether the victim was killed somewhere else and then brought to West Town, or killed at the place where he was found.",
    newWords: [
      {word: "victim", phonetic: "/ˈvɪktɪm/", meaning: "受害者"},
      {word: "murder", phonetic: "/ˈmɜːdə/", meaning: "谋杀"},
      {word: "confirmed", phonetic: "/kənˈfɜːmd/", meaning: "确认"}
    ]
  },
  {
    id: 21,
    title: "Beijing Sights",
    difficulty: "medium",
    content: "I am Wei Ke from Beijing, the capital of China. In the middle of the ancient city of Beijing is the Palace Museum, also called the Forbidden City. The emperors of the Ming and Qing dynasties used to live there. It was turned into a museum in 1925. With wonderful buildings and art treasures inside, it is well worth a visit. Next to the Palace Museum is Tian'anmen Square, one of the biggest city squares in the world. Many tourists like to gather there early in the morning to watch the raising of the national flag.",
    newWords: [
      {word: "ancient", phonetic: "/ˈeɪnʃənt/", meaning: "古老的"},
      {word: "dynasties", phonetic: "/ˈdɪnəstiz/", meaning: "朝代"},
      {word: "treasures", phonetic: "/ˈtreʒəz/", meaning: "珍宝"}
    ]
  },
  {
    id: 22,
    title: "Neil Armstrong",
    difficulty: "hard",
    content: "Neil Armstrong was born on 5 August 1930 in Ohio, the USA. He became interested in flying when he took his first flight at the age of six. He received his student pilot's licence when he was sixteen. Armstrong joined the navy in 1949 and served as a pilot for three years. In 1955, he became a test pilot. He flew over 1,100 hours and tested all types of aircraft. In 1962, he was chosen to become an astronaut. In 1966, he went into space as command pilot of Gemini 8. He and David Scott managed to join two spacecraft together for the first time in space.",
    newWords: [
      {word: "licence", phonetic: "/ˈlaɪsns/", meaning: "执照"},
      {word: "aircraft", phonetic: "/ˈeəkrɑːft/", meaning: "飞机"},
      {word: "astronaut", phonetic: "/ˈæstrənɔːt/", meaning: "宇航员"},
      {word: "spacecraft", phonetic: "/ˈspeɪskrɑːft/", meaning: "航天器"}
    ]
  },
  {
    id: 23,
    title: "Mr Jiang's Robot",
    difficulty: "medium",
    content: "Mr Jiang is a manager of a big company in Sunshine Town. He is always too busy to have any time to relax. \"I have to buy a robot so that I can have more free time,\" Mr Jiang thought. So he ordered one from a robot shop. The robot made Mr Jiang's life much easier. When he got up in the morning, breakfast was made, his business suit was smoothly ironed, and his lunch box was already prepared. That made him very happy. While Mr Jiang was at work, the robot would do all the housework. It would go shopping at the supermarket as well.",
    newWords: [
      {word: "manager", phonetic: "/ˈmænɪdʒə/", meaning: "经理"},
      {word: "smoothly", phonetic: "/ˈsmuːðli/", meaning: "平稳地"},
      {word: "ironed", phonetic: "/ˈaɪənd/", meaning: "熨烫"}
    ]
  },
  {
    id: 24,
    title: "Life on Mars",
    difficulty: "hard",
    content: "Some people believe that humans could live on the planet Mars by the year 2100. Our own planet, the Earth, is becoming more and more crowded and polluted because of the rapid increase in population. It is hoped that people could start all over again and build a better world on Mars. Here is what life there could be like. At present, our spacecraft are too slow to carry large numbers of passengers to Mars—it would take months. With the development of technology, by the year 2100, the journey might only take about 20 minutes in spacecraft that travel at the speed of light!",
    newWords: [
      {word: "planet", phonetic: "/ˈplænɪt/", meaning: "行星"},
      {word: "crowded", phonetic: "/ˈkraʊdɪd/", meaning: "拥挤的"},
      {word: "polluted", phonetic: "/pəˈluːtɪd/", meaning: "被污染的"},
      {word: "technology", phonetic: "/tekˈnɒlədʒi/", meaning: "技术"}
    ]
  },
];

// 用户类型
interface User {
  id: number;
  username: string;
  avatar: string;
}

// 录音类型
interface Recording {
  id: number;
  user_id: number;
  article_id: number;
  article_title: string;
  audio_key: string;
  audio_url: string;
  duration: number;
  comment: string;
  likes: number;
  created_at: string;
  liked: boolean;
  users: {
    id: number;
    username: string;
    avatar: string;
  };
}

// 统计类型
interface StudyStats {
  total_days: number;
  streak: number;
  articles_read: string;
  words_learned: number;
  today_seconds: number;
  week_seconds: number;
  month_seconds: number;
  daily_goal: number;
}

export default function ReadingPractice() {
  // 状态
  const [currentView, setCurrentView] = useState<'library' | 'practice' | 'stats' | 'community'>('library');
  const [currentArticle, setCurrentArticle] = useState<typeof articles[0] | null>(null);
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState<User | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [checkIns, setCheckIns] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  
  // 语音合成
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [autoHighlight, setAutoHighlight] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const wordElementsRef = useRef<HTMLSpanElement[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // 录音相关
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 签到成功弹窗
  const [showCheckinSuccess, setShowCheckinSuccess] = useState(false);
  const [checkinStreak, setCheckinStreak] = useState(0);

  // 初始化用户
  useEffect(() => {
    const initUser = async () => {
      const storedUserId = localStorage.getItem('userId');
      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: storedUserId }),
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('userId', data.user.id);
        }
      } catch (error) {
        console.error('Init user error:', error);
      }
    };
    initUser();
  }, []);

  // 加载统计数据
  useEffect(() => {
    if (user) {
      loadStats();
      loadCheckIns();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/stats?userId=${user.id}`);
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const loadCheckIns = async () => {
    if (!user) return;
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth() + 1;
    try {
      const res = await fetch(`/api/checkin?userId=${user.id}&year=${year}&month=${month}`);
      const data = await res.json();
      setCheckIns(data.checkIns || []);
    } catch (error) {
      console.error('Load check-ins error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadCheckIns();
    }
  }, [calendarMonth, user]);

  // 加载社区录音
  const loadRecordings = async (articleId?: number) => {
    try {
      const params = new URLSearchParams();
      if (articleId) params.set('articleId', articleId.toString());
      if (user) params.set('userId', user.id.toString());
      params.set('filter', 'new');
      
      const res = await fetch(`/api/recordings?${params}`);
      const data = await res.json();
      setRecordings(data.recordings || []);
    } catch (error) {
      console.error('Load recordings error:', error);
    }
  };

  useEffect(() => {
    if (currentView === 'community') {
      loadRecordings();
    }
  }, [currentView, user]);

  // 数字转英文序数词
  const numberToOrdinal = (num: number): string => {
    const ordinals: { [key: number]: string } = {
      1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth',
      6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth',
      11: 'eleventh', 12: 'twelfth', 13: 'thirteenth', 14: 'fourteenth',
      15: 'fifteenth', 16: 'sixteenth', 17: 'seventeenth', 18: 'eighteenth',
      19: 'nineteenth', 20: 'twentieth', 21: 'twenty-first', 22: 'twenty-second',
      23: 'twenty-third', 24: 'twenty-fourth', 25: 'twenty-fifth',
      26: 'twenty-sixth', 27: 'twenty-seventh', 28: 'twenty-eighth',
      29: 'twenty-ninth', 30: 'thirtieth', 31: 'thirty-first'
    };
    if (ordinals[num]) return ordinals[num];
    
    // 对于其他数字，使用基数词
    const tensWords = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const onesWords = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                       'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
                       'seventeen', 'eighteen', 'nineteen'];
    
    if (num < 20) return onesWords[num];
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      return tensWords[tens] + (ones ? '-' + onesWords[ones] : '');
    }
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const rest = num % 100;
      return onesWords[hundreds] + ' hundred' + (rest ? ' ' + numberToOrdinal(rest) : '');
    }
    return num.toString();
  };

  // 数字转英文基数词
  const numberToCardinal = (num: number): string => {
    const onesWords = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                       'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
                       'seventeen', 'eighteen', 'nineteen'];
    const tensWords = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if (num === 0) return 'zero';
    if (num < 20) return onesWords[num];
    if (num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      return tensWords[tens] + (ones ? '-' + onesWords[ones] : '');
    }
    if (num < 1000) {
      const hundreds = Math.floor(num / 100);
      const rest = num % 100;
      return onesWords[hundreds] + ' hundred' + (rest ? ' ' + numberToCardinal(rest) : '');
    }
    return num.toString();
  };

  // 将文本中的数字转换为英文单词（用于朗读）
  const convertNumbersToWords = (text: string): string => {
    // 匹配纯数字或带逗号的数字（如 40,000）
    return text.replace(/\b[\d,]+\b/g, (match) => {
      const numStr = match.replace(/,/g, '');
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > 0) {
        // 对于1-31的数字，使用序数词（可能是日期）
        if (num >= 1 && num <= 31) {
          return numberToOrdinal(num);
        }
        return numberToCardinal(num);
      }
      return match;
    });
  };

  // 语音合成 - 开始播放
  const speakText = () => {
    if (!currentArticle) return;
    
    // 将数字转换为英文单词用于朗读
    const speakableContent = convertNumbersToWords(currentArticle.content);
    
    const utterance = new SpeechSynthesisUtterance(speakableContent);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    utteranceRef.current = utterance;
    
    if (autoHighlight) {
      // 注意：renderContent 使用 split(/(\s+)/) 分割，保留空格作为独立token
      // 我们需要建立 映射：朗读文本字符位置 -> 渲染token索引
      const renderTokens = currentArticle.content.split(/(\s+)/);
      
      // 计算每个朗读token在 speakableContent 中的起始位置
      // 由于数字转换后长度变化，需要重新计算
      const tokenPositions: { index: number; startChar: number; length: number }[] = [];
      let currentChar = 0;
      
      for (let i = 0; i < renderTokens.length; i++) {
        const token = renderTokens[i];
        
        if (!token.trim()) {
          // 空格token，不朗读，在speakableContent中占用1个字符（空格）
          currentChar += token.length;
          continue;
        }
        
        let spokenLength = 0;
        
        // 检查是否是数字（可能带标点或中间有逗号，如 "31." 或 "40,000"）
        if (/^[\d,]+[.,!?;:'"]*$/.test(token)) {
          const numStr = token.replace(/,/g, '').replace(/[.,!?;:'"]+$/, '');
          const num = parseInt(numStr, 10);
          const punctuation = token.replace(/^[\d,]+/, '');
          if (num >= 1 && num <= 31) {
            spokenLength = numberToOrdinal(num).length;
          } else {
            spokenLength = numberToCardinal(num).length;
          }
          spokenLength += punctuation.length; // 标点符号保持不变
        } else if (/^[a-zA-Z]+[.,!?;:'"]*$/.test(token)) {
          // 单词（可能带标点）
          spokenLength = token.length;
        } else {
          // 其他情况（如纯标点）
          currentChar += token.length;
          continue;
        }
        
        tokenPositions.push({
          index: i,
          startChar: currentChar,
          length: spokenLength
        });
        
        currentChar += spokenLength;
        // 加上后面的空格（如果有）
        if (i + 1 < renderTokens.length && !renderTokens[i + 1].trim()) {
          currentChar += renderTokens[i + 1].length;
        }
      }
      
      utterance.onboundary = (event) => {
        const charIndex = event.charIndex;
        
        // 找到当前字符位置对应的token
        for (let j = 0; j < tokenPositions.length; j++) {
          const pos = tokenPositions[j];
          if (charIndex >= pos.startChar && charIndex < pos.startChar + pos.length) {
            setCurrentWordIndex(pos.index);
            break;
          }
        }
      };
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
      utteranceRef.current = null;
    };
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  // 暂停/继续播放
  const togglePause = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // 停止播放
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    utteranceRef.current = null;
  };

  // 从头开始播放
  const restartSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    // 稍微延迟后重新开始
    setTimeout(() => {
      speakText();
    }, 100);
  };

  const speakWord = (word: string) => {
    // 处理数字：将数字转换为英文单词朗读
    const num = parseInt(word, 10);
    if (!isNaN(num) && num > 0) {
      // 对于1-31的数字，假设可能是日期，使用序数词
      if (num >= 1 && num <= 31) {
        word = numberToOrdinal(num);
      } else {
        word = numberToCardinal(num);
      }
    }
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    window.speechSynthesis.speak(utterance);
  };

  // 打开文章
  const openArticle = async (article: typeof articles[0]) => {
    setCurrentArticle(article);
    setCurrentView('practice');
    loadRecordings(article.id);
    
    // 记录阅读
    if (user) {
      await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          addArticle: article.id,
          addWords: article.newWords.length,
        }),
      });
      loadStats();
    }
  };

  // 签到
  const handleCheckIn = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        setCheckinStreak(data.streak);
        setShowCheckinSuccess(true);
        loadStats();
        loadCheckIns();
      }
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  // 点赞
  const handleLike = async (recordingId: number, currentlyLiked: boolean) => {
    if (!user) return;
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          recordingId,
        }),
      });
      const data = await res.json();
      
      setRecordings(prev => prev.map(r => 
        r.id === recordingId 
          ? { ...r, liked: data.liked, likes: data.likes }
          : r
      ));
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  // 录音功能
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    } catch (error) {
      console.error('Recording error:', error);
      alert('无法访问麦克风');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecording(false);
  };

  const submitRecording = async () => {
    if (!recordedBlob || !currentArticle || !user) return;
    
    const formData = new FormData();
    formData.append('userId', user.id.toString());
    formData.append('articleId', currentArticle.id.toString());
    formData.append('articleTitle', currentArticle.title);
    formData.append('duration', recordingTime.toString());
    formData.append('audio', recordedBlob, 'recording.webm');
    
    try {
      const res = await fetch('/api/recordings', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.recording) {
        setRecordings(prev => [data.recording, ...prev]);
        setShowRecordModal(false);
        setRecordedBlob(null);
        setRecordingTime(0);
        alert('发布成功！');
      }
    } catch (error) {
      console.error('Submit recording error:', error);
      alert('发布失败');
    }
  };

  // 渲染文章内容
  const renderContent = () => {
    if (!currentArticle) return null;
    const newWordMap = new Map(currentArticle.newWords.map(w => [w.word.toLowerCase(), w]));
    const tokens = currentArticle.content.split(/(\s+)/);
    
    return tokens.map((token, idx) => {
      if (!token.trim()) return token;
      const cleanToken = token.toLowerCase().replace(/[.,!?;:'"]/g, '');
      const wordData = newWordMap.get(cleanToken);
      
      // 处理单词（可能带标点符号）
      if (/^[a-zA-Z]+[.,!?;:'"]*$/.test(token)) {
        const isNewWord = !!wordData;
        const isHighlighted = idx === currentWordIndex;
        
        return (
          <span
            key={idx}
            ref={el => { if (el) wordElementsRef.current[idx] = el; }}
            onClick={() => speakWord(cleanToken)}
            className={`
              cursor-pointer px-0.5 py-0.5 rounded transition-all duration-150 inline-block
              ${isNewWord ? 'bg-yellow-100 border-b-2 border-yellow-500 font-medium' : ''}
              ${isHighlighted ? 'bg-blue-200 shadow-sm' : ''}
              hover:bg-blue-100
            `}
            title={isNewWord ? `${wordData.phonetic} - ${wordData.meaning}` : '点击朗读'}
          >
            {token}
            {isNewWord && (
              <span className="text-xs text-gray-500 ml-0.5">{wordData.phonetic}</span>
            )}
          </span>
        );
      }
      
      // 处理数字（可能带标点，如 "31." 或中间有逗号如 "40,000"）
      if (/^[\d,]+[.,!?;:'"]*$/.test(token)) {
        const numStr = token.replace(/,/g, '').replace(/[.,!?;:'"]+$/, '');
        const punctuation = token.replace(/^[\d,]+/, '');
        const num = parseInt(numStr, 10);
        const isDateNumber = num >= 1 && num <= 31;
        const spokenForm = isDateNumber ? numberToOrdinal(num) : numberToCardinal(num);
        const isHighlighted = idx === currentWordIndex;
        
        return (
          <span
            key={idx}
            onClick={() => speakWord(numStr)}
            className={`
              cursor-pointer px-0.5 py-0.5 rounded transition-all duration-150 inline-block
              text-blue-700 font-medium
              ${isHighlighted ? 'bg-blue-200 shadow-sm' : ''}
              hover:bg-blue-100
            `}
            title={`点击朗读: ${spokenForm}`}
          >
            {token}
          </span>
        );
      }
      
      return <span key={idx}>{token}</span>;
    });
  };

  // 渲染日历
  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date().toISOString().split('T')[0];
    
    const days = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isChecked = checkIns.includes(dateStr);
      const isToday = dateStr === today;
      const isFuture = new Date(dateStr) > new Date();
      
      days.push(
        <div
          key={day}
          className={`
            aspect-square flex items-center justify-center rounded-lg text-sm font-medium
            ${isChecked ? 'bg-green-500 text-white shadow-md' : ''}
            ${isToday && !isChecked ? 'border-2 border-blue-500' : ''}
            ${isFuture ? 'text-gray-300' : ''}
          `}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  // 过滤文章
  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(a => a.difficulty === filter);

  const difficultyLabels: Record<string, string> = {
    easy: '初级',
    medium: '中级',
    hard: '高级',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-500">
      {/* 头部 */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
              🍃
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
                忍冬人机对话
              </h1>
              <p className="text-[10px] text-gray-500">Reading Practice</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <span>{user.avatar}</span>
                <span className="text-sm font-medium">{user.username}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-5xl mx-auto px-4 py-4 pb-24">
        {/* 文章库 */}
        {currentView === 'library' && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div className="text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">朗读材料库</h2>
                <p className="text-blue-100 text-sm">点击单词听发音，生词自动标注音标</p>
              </div>
              <div className="flex gap-1.5 bg-white/20 backdrop-blur rounded-xl p-1.5">
                {['all', 'easy', 'medium', 'hard'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      filter === f ? 'bg-white/30 text-white' : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {f === 'all' ? '全部' : difficultyLabels[f]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map(article => (
                <div
                  key={article.id}
                  onClick={() => openArticle(article)}
                  className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      article.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      article.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {difficultyLabels[article.difficulty]}
                    </span>
                    <span className="text-xs text-gray-400">#{article.id}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {article.content.substring(0, 80)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.content.split(/\s+/).length} 词</span>
                    <span>{article.newWords.length} 生词</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 朗读练习 */}
        {currentView === 'practice' && currentArticle && (
          <section className="space-y-4">
            <button
              onClick={() => { setCurrentView('library'); setCurrentArticle(null); }}
              className="text-white hover:text-blue-200 flex items-center gap-2 font-medium"
            >
              ← 返回列表
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                {/* 文章卡片 */}
                <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
                  <div className="flex flex-col gap-4 mb-6 border-b border-gray-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          currentArticle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          currentArticle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {difficultyLabels[currentArticle.difficulty]}
                        </span>
                        <span className="text-xs text-gray-400">#{currentArticle.id}</span>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900">{currentArticle.title}</h1>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-full">
                          {currentArticle.content.split(/\s+/).length} 词
                        </span>
                        <span className="bg-yellow-50 px-2 py-1 rounded-full">
                          {currentArticle.newWords.length} 生词
                        </span>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1.5">
                        {/* 播放/暂停按钮 */}
                        <button
                          onClick={() => {
                            if (!isSpeaking) {
                              speakText();
                            } else {
                              togglePause();
                            }
                          }}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
                            isSpeaking && !isPaused 
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                          title={isSpeaking ? (isPaused ? '继续播放' : '暂停') : '播放'}
                        >
                          {isSpeaking ? (isPaused ? '▶' : '⏸') : '▶'}
                        </button>
                        {/* 停止按钮 */}
                        <button
                          onClick={stopSpeaking}
                          className="w-9 h-9 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300"
                          title="停止"
                        >
                          ⏹
                        </button>
                        {/* 重新开始按钮 */}
                        <button
                          onClick={restartSpeaking}
                          className="w-9 h-9 bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-300"
                          title="从头开始"
                        >
                          ⏮
                        </button>
                        <div className="h-6 w-px bg-gray-300 mx-1" />
                        <button
                          onClick={() => setSpeechRate(r => Math.max(0.5, r - 0.1))}
                          className="px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg"
                        >
                          −
                        </button>
                        <span className="text-xs font-bold text-blue-600 min-w-[2.5rem] text-center">
                          {speechRate.toFixed(1)}x
                        </span>
                        <button
                          onClick={() => setSpeechRate(r => Math.min(1.5, r + 0.1))}
                          className="px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-lg leading-relaxed text-gray-800">
                    {renderContent()}
                  </div>
                </div>

                {/* 社区录音 */}
                <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      🎤 朗读社区
                    </h3>
                    <button
                      onClick={() => setShowRecordModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      🎙️ 发布朗读
                    </button>
                  </div>
                  
                  {recordings.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <p className="text-3xl mb-2">🎙️</p>
                      <p className="text-sm">暂无朗读作品，快来发布第一个吧！</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {recordings.map(rec => (
                        <div key={rec.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                            {rec.users?.avatar || '👤'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{rec.users?.username || '用户'}</span>
                              <span className="text-xs text-gray-400">{formatTime(rec.duration)}</span>
                            </div>
                            {rec.audio_url && (
                              <audio src={rec.audio_url} controls className="w-full h-6" />
                            )}
                          </div>
                          <button
                            onClick={() => handleLike(rec.id, rec.liked)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                              rec.liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                            }`}
                          >
                            ❤️ {rec.likes}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 侧边栏 */}
              <div className="space-y-4">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">📖 生词表</h3>
                    <button
                      onClick={() => currentArticle.newWords.forEach(w => speakWord(w.word))}
                      className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-200"
                    >
                      ▶ 朗读全部
                    </button>
                  </div>
                  <div className="space-y-2">
                    {currentArticle.newWords.map((word, idx) => (
                      <div
                        key={idx}
                        onClick={() => speakWord(word.word)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-blue-50 transition"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{word.word}</span>
                            <span className="text-xs text-gray-500">{word.phonetic}</span>
                          </div>
                          <p className="text-sm text-gray-600">{word.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 学习数据 */}
        {currentView === 'stats' && (
          <section className="space-y-4">
            <button
              onClick={() => setCurrentView('library')}
              className="text-white hover:text-blue-200 flex items-center gap-2 font-medium"
            >
              ← 返回列表
            </button>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                📊 学习数据中心
              </h2>

              {/* 统计卡片 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 text-center shadow">
                  <div className="text-3xl font-bold text-blue-600">{stats?.total_days || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">累计学习天数</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 text-center shadow">
                  <div className="text-3xl font-bold text-green-600">{stats?.streak || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">连续签到</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 text-center shadow">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats?.articles_read ? JSON.parse(stats.articles_read).length : 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">已读文章</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 text-center shadow">
                  <div className="text-3xl font-bold text-orange-600">{stats?.words_learned || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">学习生词</div>
                </div>
              </div>

              {/* 签到日历 */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">📅 签到日历</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCalendarMonth(d => new Date(d.getFullYear(), d.getMonth() - 1))}
                      className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      ←
                    </button>
                    <span className="font-medium text-gray-700 min-w-[100px] text-center">
                      {calendarMonth.getFullYear()}年{calendarMonth.getMonth() + 1}月
                    </span>
                    <button
                      onClick={() => setCalendarMonth(d => new Date(d.getFullYear(), d.getMonth() + 1))}
                      className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                    <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={handleCheckIn}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl"
                  >
                    ✓ 今日签到
                  </button>
                </div>
              </div>

              {/* 学习时间 */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-bold text-gray-800 mb-4">⏱️ 学习时间统计</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">今日学习</span>
                      <span className="font-medium">{Math.floor((stats?.today_seconds || 0) / 60)} 分钟</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${Math.min(100, ((stats?.today_seconds || 0) / 60 / (stats?.daily_goal || 30)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">本周学习</span>
                      <span className="font-medium">{Math.floor((stats?.week_seconds || 0) / 60)} 分钟</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${Math.min(100, ((stats?.week_seconds || 0) / 60 / ((stats?.daily_goal || 30) * 7)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 社区 */}
        {currentView === 'community' && (
          <section className="space-y-4">
            <button
              onClick={() => setCurrentView('library')}
              className="text-white hover:text-blue-200 flex items-center gap-2 font-medium"
            >
              ← 返回列表
            </button>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                👥 朗读社区
              </h2>

              {recordings.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-4">🎙️</p>
                  <p>暂无朗读作品</p>
                  <p className="text-sm">去文章页面发布你的第一个朗读作品吧！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recordings.map(rec => (
                    <div key={rec.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {rec.users?.avatar || '👤'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{rec.users?.username || '用户'}</span>
                            <span className="text-xs text-gray-400">{formatTimeAgo(rec.created_at)}</span>
                          </div>
                          <p className="text-sm text-gray-600">{rec.comment}</p>
                          <p className="text-xs text-blue-600 mt-1">📖 {rec.article_title}</p>
                        </div>
                      </div>
                      
                      {rec.audio_url && (
                        <audio src={rec.audio_url} controls className="w-full mb-3" />
                      )}

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleLike(rec.id, rec.liked)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                            rec.liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                          }`}
                        >
                          ❤️ {rec.likes}
                        </button>
                        <button
                          onClick={() => {
                            const article = articles.find(a => a.id === rec.article_id);
                            if (article) openArticle(article);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          查看原文 →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'library', icon: '📚', label: '材料库' },
            { id: 'stats', icon: '📊', label: '学习数据' },
            { id: 'community', icon: '🎤', label: '社区' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id !== 'practice') {
                  setCurrentView(tab.id as any);
                  setCurrentArticle(null);
                }
              }}
              className={`flex flex-col items-center gap-1 px-4 py-2 ${
                currentView === tab.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 录音弹窗 */}
      <AnimatePresence>
        {showRecordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowRecordModal(false)} />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-20 right-4 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                <span className="font-medium text-sm">发布朗读</span>
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 text-center">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ${
                    isRecording 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-gradient-to-br from-red-500 to-red-600'
                  } text-white`}
                >
                  {isRecording ? '⏹' : '🎙️'}
                </button>
                <p className="text-gray-500 text-sm">
                  {isRecording ? '正在录音...' : recordedBlob ? '录音完成' : '点击开始录音'}
                </p>
                {(isRecording || recordingTime > 0) && (
                  <p className="text-xl font-bold text-blue-600 mt-2">{formatTime(recordingTime)}</p>
                )}
              </div>

              {recordedBlob && (
                <div className="px-4 pb-3">
                  <audio src={URL.createObjectURL(recordedBlob)} controls className="w-full h-8" />
                </div>
              )}

              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => { setShowRecordModal(false); setRecordedBlob(null); setRecordingTime(0); }}
                  className="flex-1 py-2.5 text-gray-500 text-sm font-medium hover:bg-gray-50"
                >
                  取消
                </button>
                <div className="w-px bg-gray-100" />
                <button
                  onClick={submitRecording}
                  disabled={!recordedBlob}
                  className="flex-1 py-2.5 text-blue-600 text-sm font-medium hover:bg-blue-50 disabled:opacity-40"
                >
                  发布
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 签到成功弹窗 */}
      <AnimatePresence>
        {showCheckinSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={() => setShowCheckinSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">签到成功！</h3>
              <p className="text-gray-600 mb-4">
                连续签到 <span className="text-green-600 font-bold">{checkinStreak}</span> 天
              </p>
              <button
                onClick={() => setShowCheckinSuccess(false)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium"
              >
                继续学习
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
