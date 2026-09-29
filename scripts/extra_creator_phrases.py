# coding: utf-8
EXTRA = {}

def a(k, es, fr, de, zh, ar, hi, pt, ru, ja, ur, bn):
    EXTRA[k.strip().lower()] = {
        "es": es, "fr": fr, "de": de, "zh": zh, "ar": ar,
        "hi": hi, "pt": pt, "ru": ru, "ja": ja, "ur": ur, "bn": bn
    }

a('Launch Mock Simulation',
  'Iniciar Simulación de Examen', 'Lancer la Simulation d\'Examen', 'Prüfungssimulation starten',
  '开启全真模拟考试', 'بدء اختبار المحاكاة', 'मॉक सिमुलेशन शुरू करें',
  'Iniciar Simulado Oficial', 'Запустить симуляцию экзамена', '本番模擬試験を開始',
  'ماک سمولیشن شروع کریں', 'মক সিমুলেশন শুরু করুন')

a('Return to Catalog',
  'Volver al Catálogo', 'Retourner au Catalogue', 'Zurück zum Katalog',
  '返回题库总目录', 'العودة إلى الفهرس', 'कैटलॉग पर वापस जाएँ',
  'Retornar ao Catálogo', 'Вернуться в каталог', '試験カタログへ戻る',
  'کیٹلاگ پر واپس جائیں', 'ক্যাটালগে ফিরে যান')

a('Department of English Language & Literature',
  'Departamento de Lengua y Literatura Inglesa', 'Département de Langue et Littérature Anglaises',
  'Institut für englische Sprache und Literatur', '英语语言与文学系',
  'قسم اللغة الإنجليزية وآدابها', 'अंग्रेजी भाषा और साहित्य विभाग',
  'Departamento de Língua e Literatura Inglesa', 'Кафедра английского языка и литературы',
  '英語英米文学科', 'انگریزی زبان و ادب کا شعبہ', 'ইংরেজি ভাষা ও সাহিত্য বিভাগ')

a('Developer • IELTS Educator • Writer • Researcher',
  'Desarrollador • Educador de IELTS • Escritor • Investigador',
  'Développeur • Éducateur IELTS • Écrivain • Chercheur',
  'Entwickler • IELTS-Dozent • Schriftsteller • Forscher',
  '软件工程师 • 雅思教育家 • 青年作家 • 学术学者',
  'مطور برمجيات • معلم آيلتس • كاتب • باحث',
  'डेवलपर • आईईएलटीएस शिक्षक • लेखक • शोधकर्ता',
  'Desenvolvedor • Educador de IELTS • Escritor • Pesquisador',
  'Разработчик • Преподаватель IELTS • Писатель • Исследователь',
  '開発者 • IELTS指導専門家 • 作家 • 研究員',
  'ڈویلپر • آئیلٹس استاد • مصنف • محقق',
  'ডেভেলপার • আইইএলটিএস শিক্ষক • লেখক • গবেষক')

a('Architecture of Vocabino Institute',
  'Arquitectura de Vocabino Institute', 'Architecture de l\'Institut Vocabino',
  'Architektur des Vocabino-Instituts', 'Vocabino 国际学院的教学与技术架构',
  'الهندسة المعمارية والتقنية لمعهد فوكابينو', 'वोकैबिनो संस्थान की वास्तुकला',
  'Arquitetura do Instituto Vocabino', 'Архитектура Vocabino Institute',
  'Vocabino Instituteのシステム構成と設計思想', 'ووکیبینو انسٹی ٹیوٹ کا تعلیمی و تکنیکی ڈھانچہ',
  'ভোকাবিনো ইনস্টিটিউটের স্থাপত্য')

a('Engineered by Hamid Ali from the ground up to solve critical deficiencies in conventional IELTS test prep portals.',
  'Diseñado por Hamid Ali desde cero para resolver deficiencias críticas en los portales convencionales de preparación para el IELTS.',
  'Conçu par Hamid Ali de toutes pièces pour remédier aux lacunes critiques des plateformes traditionnelles de préparation à l\'IELTS.',
  'Von Grund auf von Hamid Ali entwickelt, um entscheidende Mängel herkömmlicher IELTS-Vorbereitungsportale zu beheben.',
  '由 Hamid Ali 从零自主研发设计，旨在彻底解决传统商业雅思备考平台昂贵锁门与模考不真的核心痛点。',
  'تم تصميمه وتطويره بواسطة حامد علي من الأساس لحل أوجه القصور الحرجة في منصات التحضير التقليدية للآيلتس.',
  'हामिद अली द्वारा पारंपरिक आईईएलटीएस परीक्षा तैयारी पोर्टल्स में महत्वपूर्ण कमियों को हल करने के लिए शुरू से तैयार किया गया।',
  'Projetado por Hamid Ali do zero para resolver deficiências críticas nos portais convencionais de preparação para o IELTS.',
  'Разработано Хамидом Али с нуля для устранения критических недостатков традиционных порталов подготовки к IELTS.',
  '従来の商業用IELTS対策ポータルの致命的な欠陥を解消するため、ハミド・アリによってゼロから設計・構築されました。',
  'حامد علی نے روایتی آئیلٹس تیاری کے پلیٹ فارمز کی بنیادی خامیوں کو دور کرنے کے لیے اسے شروع سے تیار کیا۔',
  'প্রচলিত আইইএলটিএস পরীক্ষার প্রস্তুতি পোর্টালের গুরুত্বপূর্ণ ত্রুটিগুলি সমাধান করতে হামিদ আলী প্রথম থেকেই এটি তৈরি করেছেন।')

a('Replicates the actual IDP and British Council exam interface with dual-pane reading passages, audio controls, live word counters, and strict timed countdown clocks.',
  'Reproduce la interfaz de examen real de IDP y British Council con textos de lectura en panel doble, controles de audio, contadores de palabras en vivo y estrictos relojes de cuenta regresiva.',
  'Reproduit l\'interface d\'examen réelle de l\'IDP et du British Council avec affichage bivolet des textes, commandes audio, compteurs de mots en direct et compteurs à rebours stricts.',
  'Repliziert die tatsächliche Prüfungsoberfläche von IDP und British Council mit zweispaltigen Lesetexten, Audiosteuerungen, Live-Wortzählern und strengen Countdown-Uhren.',
  '1:1 深度还原 IDP 与英国文化协会真实机考界面，包含双栏分屏阅卷、听力音频控制条、实时写作字数统计与严格的考场倒计时时钟。',
  'يحاكي واجهة الاختبار الفعلية لـ IDP والمجلس الثقافي البريطاني مع نصوص قراءة مزدوجة وعناصر تحكم بالصوت وعداد كلمات وساعات توقيت دقيقة.',
  'आईडीपी और ब्रिटिश काउंसिल के वास्तविक परीक्षा इंटरफ़ेस को दोहरे फलक वाले पठन अंशों, ऑडियो नियंत्रणों, लाइव शब्द काउंटरों और समयबद्ध घड़ियों के साथ दोहराता है।',
  'Replica a interface real de exame do IDP e British Council com passagens de leitura em painel duplo, controles de áudio, contadores de palavras e relógios de contagem regressiva.',
  'Точно воспроизводит реальный интерфейс экзамена IDP и British Council с двухпанельным чтением, элементами управления звуком, счетчиками слов и точными таймерами.',
  '2ペイン構成のリーディング読解画面、音声操作パネル、リアルタイム単語数カウンター、厳密なカウントダウン時計など、IDPやブリティッシュ・カウンシルの本番機考画面を忠実に再現。',
  'آئی ڈی پی اور برٹش کونسل کے اصل امتحانی انٹرفیس کی نقل کرتا ہے جس میں دو پین والے ریڈنگ پیراگراف، آڈیو کنٹرول، لائیو ورڈ کاؤنٹر اور سخت ٹائمرز شامل ہیں۔',
  'ডুয়াল-পেন পঠন অনুচ্ছেদ, অডিও নিয়ন্ত্রণ, লাইভ শব্দ কাউন্টার এবং কঠোর কাউন্টডাউন ঘড়ি সহ আসল আইডিপি এবং ব্রিটিশ কাউন্সিল পরীক্ষার ইন্টারফেসের প্রতিলিপি তৈরি করে।')

a('Custom scoring matrix evaluating candidate writing across Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range with instant Band feedback.',
  'Matriz de puntuación personalizada que evalúa la redacción del candidato en Cumplimiento de la Tarea, Coherencia y Cohesión, Recursos Léxicos y Rango Gramatical con retroalimentación instantánea de Banda.',
  'Grille d\'évaluation personnalisée analysant la rédaction du candidat sur la Réalisation de la Tâche, la Cohérence et Cohésion, la Richesse Lexicale et la Maîtrise Grammaticale avec score instantané.',
  'Maßgeschneiderte Bewertungsmatrix, die die Schreibaufgaben des Kandidaten in Aufgabenerfüllung, Kohärenz & Kohäsion, Wortschatz und Grammatik mit sofortigem Band-Feedback bewertet.',
  '考官级写作批改评估算法，从任务完成度、连贯与衔接、词汇多样性以及语法结构四大官方维度深度剖析并秒级给出预估雅思分值。',
  'مصفوفة تصحيح مخصصة تقيّم كتابة المرشح عبر إنجاز المهمة والتماسك والترابط والموارد اللغوية والدقة النحوية مع تقييم فوري للدرجة.',
  'कस्टम स्कोरिंग मैट्रिक्स जो कार्य उपलब्धि, सामंजस्य और सुसंगतता, शब्दावली संसाधन, और व्याकरणिक सीमा में उम्मीदवार के लेखन का मूल्यांकन करता है।',
  'Matriz de pontuação personalizada avaliando a redação do candidato em Cumprimento da Tarefa, Coerência e Coesão, Recursos Lexicais e Variedade Gramatical.',
  'Интеллектуальная матрица оценивания, анализирующая письмо кандидата по выполнению задания, связности, словарному запасу и грамматике с мгновенным определением балла.',
  'タスク達成度、一貫性と結束性、語彙力、文法力と正確さの4大公式基準に基づき、受験者のライティングを瞬時に解析・採点する独自評価マトリクス。',
  'اپنی مرضی کے مطابق اسکورنگ میٹرکس جو امیدوار کی تحریر کا ٹاسک کی تکمیل، ربط و تسلسل، ذخیرہ الفاظ اور گرامر کے تحت فوری بینڈ تجزیہ کرتا ہے۔',
  'কাস্টম স্কোরিং ম্যাট্রিক্স যা টাস্ক অর্জন, সংগতি ও সংযুক্তি, শব্দভাণ্ডার সম্পদ, এবং ব্যাকরণগত ব্যাপ্তি জুড়ে পরীক্ষার্থীর লেখার মূল্যায়ন করে তাৎক্ষণিক ব্যান্ড ফলাফল প্রদান করে।')

a('Every completed full mock test generates an authentic Test Report Form with a unique verification code that can be verified in real time on Vocabino\'s public verification portal.',
  'Cada simulacro completo terminado genera un Formulario de Informe de Prueba auténtico con un código de verificación único que se puede comprobar en tiempo real en el portal público de verificación de Vocabino.',
  'Chaque examen blanc complet génère un formulaire de rapport de test authentique avec un code de vérification unique pouvant être vérifié en direct sur le portail public de Vocabino.',
  'Jede abgeschlossene vollständige Probeprüfung erzeugt einen authentischen Test Report Form mit einem eindeutigen Prüfcode, der in Echtzeit auf dem Verifizierungsportal überprüft werden kann.',
  '每份顺利完成的四科全真模考均会生成带有一对一唯一加密防伪编码的雅思官方电子成绩报告单（TRF），任何院校与机构均可在 Vocabino 成绩核验门户秒级验证。',
  'كل اختبار محاكاة كامل يتم إنجازه يولد استمارة تقرير اختبار (TRF) أصلية مع رمز تحقق فريد يمكن التحقق منه لحظياً عبر بوابة فوكابينو العامة.',
  'प्रत्येक पूर्ण मॉक टेस्ट एक प्रामाणिक टेस्ट रिपोर्ट फॉर्म उत्पन्न करता है जिसमें एक अद्वितीय सत्यापन कोड होता है जिसे वोकैबिनो के सार्वजनिक पोर्टल पर सत्यापित किया जा सकता है।',
  'Cada simulado completo finalizado gera um formulário de relatório de teste autêntico com um código de verificação único que pode ser verificado em tempo real.',
  'Каждый завершенный полный тест создает подлинную форму TRF с уникальным кодом, который можно мгновенно проверить на публичном портале верификации Vocabino.',
  '完了した完全模擬試験ごとに、Vocabino公式照会ポータルで即座に真偽確認できる固有の検証コードが付与された公式TRF（成績証明書）が自動発行されます。',
  'ہر مکمل ماک ٹیسٹ ایک مستند ٹیسٹ رپورٹ فارم بناتا ہے جس میں ایک منفرد تصدیقی کوڈ ہوتا ہے جسے ووکیبینو کے پورٹل پر فوری چیک کیا جا سکتا ہے۔',
  'প্রতিটি সম্পন্ন পূর্ণ মক টেস্ট একটি অনন্য যাচাইকরণ কোড সহ একটি প্রামাণ্য টেস্ট রিপোর্ট ফর্ম তৈরি করে যা ভোকাবিনোর পাবলিক যাচাইকরণ পোর্টালে রিয়েল টাইমে যাচাই করা যেতে পারে।')

a('Vocabino Institute • Founded by Hamid Ali (IIUI)',
  'Vocabino Institute • Fundado por Hamid Ali (IIUI)', 'Institut Vocabino • Fondé par Hamid Ali (IIUI)',
  'Vocabino Institute • Gegründet von Hamid Ali (IIUI)', 'Vocabino 国际语言学院 • 由 Hamid Ali (IIUI) 创立研发',
  'معهد فوكابينو • أسسه حامد علي (IIUI)', 'वोकैबिनो संस्थान • हामिद अली (आईआईयूआई) द्वारा स्थापित',
  'Instituto Vocabino • Fundado por Hamid Ali (IIUI)', 'Vocabino Institute • Основан Хамидом Али (IIUI)',
  'Vocabino Institute • ハミド・アリ（IIUI）創設', 'ووکیبینو انسٹی ٹیوٹ • بانی حامد علی (IIUI)',
  'ভোকাবিনো ইনস্টিটিউট • হামিদ আলী (আইআইইউআই) দ্বারা প্রতিষ্ঠিত')

a('Explorations of human condition, psychological depth, poetry, and cognitive resilience.',
  'Exploraciones de la condición humana, profundidad psicológica, poesía y resiliencia cognitiva.',
  'Explorations de la condition humaine, de la profondeur psychologique, de la poésie et de la résilience cognitive.',
  'Erkundungen der menschlichen Verfassung, psychologischer Tiefe, Poesie und kognitiver Resilienz.',
  '对人类生存境遇、深层心理意识、古典诗歌韵律与认知韧性的深刻哲学探索。',
  'استكشافات معمقة للحالة الإنسانية والعمق النفسي والشعر والمرونة المعرفية.',
  'मानव स्थिति, मनोवैज्ञानिक गहराई, कविता और संज्ञानात्मक लचीलेपन की खोज।',
  'Explorações da condição humana, profundidade psicológica, poesia e resiliência cognitiva.',
  'Исследования человеческого бытия, психологической глубины, поэзии и когнитивной устойчивости.',
  '人間の実存的条件、心理的深層、詩情、そして認知的回復力に対する探求。',
  'انسانی حالت، نفسیاتی گہرائی، شاعری اور علمی لچک کی تلاش۔',
  'মানব অবস্থা, মনস্তাত্ত্বিক গভীরতা, কবিতা এবং জ্ঞানীয় স্থিতিস্থাপকতার অন্বেষণ।')

a('Authored by Hamid Ali at IIUI. A reflective inquiry into internal serenity, modern alienation, and rediscovering human contentment through introspection.',
  'Escrito por Hamid Ali en IIUI. Una indagación reflexiva sobre la serenidad interior, la alienación moderna y el redescubrimiento del contento humano a través de la introspección.',
  'Écrit par Hamid Ali à l\'IIUI. Une réflexion profonde sur la sérénité intérieure, l\'aliénation moderne et la redécouverte du contentement à travers l\'introspection.',
  'Verfasst von Hamid Ali an der IIUI. Eine reflektierte Auseinandersetzung mit innerer Gelassenheit, moderner Entfremdung und der Wiederentdeckung menschlicher Zufriedenheit.',
  '由 Hamid Ali 在 IIUI 创作。深入探讨现代人内心的宁静与焦虑、科技异化以及通过内省重拾生命本真幸福的哲学著作。',
  'مؤلف بواسطة حامد علي في IIUI. بحث تأملي في الصفاء الداخلي، والاغتراب الحديث، وإعادة اكتشاف الرضا البشري من خلال الاستبطان والتأمل.',
  'आईआईयूआई में हामिद अली द्वारा लिखित। आंतरिक शांति, आधुनिक अलगाव और आत्मनिरीक्षण के माध्यम से मानवीय संतोष की खोज पर एक विचारशील जांच।',
  'De autoria de Hamid Ali na IIUI. Uma investigação reflexiva sobre a serenidade interior, a alienação moderna e a redescoberta do contentamento humano.',
  'Автор — Хамид Али (IIUI). Размышление о внутреннем спокойствии, современном отчуждении и обретении душевного равновесия через самопознание.',
  'IIUIにてハミド・アリが執筆。内なる静寂、現代社会における孤独・疎外感、そして内省を通じた真の人間的幸福の再発見を問いかける思索的散文作品。',
  'IIUI میں حامد علی کی تصنیف۔ اندرونی سکون، جدید بیگانگی، اور خود شناسی کے ذریعے انسانی اطمینان کی بازیافت پر ایک فکری مطالعہ۔',
  'আইআইইউআই-তে হামিদ আলী রচিত। অভ্যন্তরীণ প্রশান্তি, আধুনিক বিচ্ছিন্নতা এবং আত্মদর্শনের মাধ্যমে মানুষের তৃপ্তি পুনঃআবিষ্কারের ওপর একটি চিন্তাশীল অনুসন্ধান।')

a('An empathetic examination of socioeconomic realities, examining the lived experiences and everyday struggles of marginalized communities.',
  'Un examen empático de las realidades socioeconómicas, analizando las experiencias vividas y las luchas cotidianas de las comunidades marginadas.',
  'Un examen empathique des réalités socio-économiques, analysant le vécu et les luttes quotidiennes des communautés marginalisées.',
  'Eine einfühlsame Untersuchung sozioökonomischer Realitäten, die gelebte Erfahrungen und alltägliche Kämpfe marginalisierter Gemeinschaften beleuchtet.',
  '一部充满人文关怀的社会学散文，深入剖析社会经济差距、底层边缘群体的真实生存困境与道德坚守。',
  'دراسة إنسانية متعاطفة للواقع الاجتماعي والاقتصادي، تبحث في التجارب المعاشة والصراعات اليومية للفئات المهمشة.',
  'सामाजिक-आर्थिक वास्तविकताओं का एक सहानुभूतिपूर्ण परीक्षण, हाशिए पर रहने वाले समुदायों के वास्तविक अनुभवों की जांच।',
  'Um exame empático das realidades socioeconômicas, analisando as vivências e lutas cotidianas das comunidades marginalizadas.',
  'Чуткое исследование социально-экономических реалий, отражающее повседневный опыт и борьбу уязвимых сообществ.',
  '社会経済的格差の実態に共感をもって迫り、恵まれないコミュニティの日々の生き様と葛藤を描き出した社会批評作品。',
  'سماجی و اقتصادی حقائق کا ایک ہمدردانہ مطالعہ، جو پسماندہ طبقات کے روزمرہ کے تجربات اور جدوجہد کا جائزہ لیتا ہے۔',
  'সামাজিক-অর্থনৈতিক বাস্তবতার একটি সহানুভূতিশীল বিশ্লেষণ, যা প্রান্তিক জনগোষ্ঠীর বাস্তব অভিজ্ঞতা এবং দৈনন্দিন সংগ্রামের চিত্র তুলে ধরে।')

a('A vibrant journey tracing the transition from structured factual thinking to imaginative discovery, curiosity, and creative courage.',
  'Un viaje vibrante que traza la transición del pensamiento factual estructurado al descubrimiento imaginativo, la curiosidad y el coraje creativo.',
  'Un voyage vibrant traçant la transition d\'une pensée factuelle structurée vers la découverte imaginative, la curiosité et le courage créatif.',
  'Eine lebendige Reise, die den Übergang von strukturiertem Faktenwissen zu fantasievoller Entdeckung, Neugier und kreativem Mut nachzeichnet.',
  '一段引人入胜的思想历险，生动描绘了心智如何从刻板的数据事实思维向天马行空的想象力、求知好奇心与艺术创造力跃迁。',
  'رحلة مفعمة بالحيوية تتبع الانتقال من التفكير الواقعي المقيد إلى الاكتشاف الخيالي والفضول والشجاعة الإبداعية.',
  'एक जीवंत यात्रा जो संरचित तथ्यात्मक सोच से कल्पनाशील खोज, जिज्ञासा और रचनात्मक साहस के संक्रमण का पता लगाती है।',
  'Uma jornada vibrante traçando a transição do pensamento factual estruturado para a descoberta imaginativa, curiosidade e coragem criativa.',
  'Увлекательное путешествие, прослеживающее переход от сухого фактологического мышления к полету воображения, любознательности и творчеству.',
  '論理的・事実的な思考から、想像力豊かな探求、知的好奇心、創造的な勇気への飛翔を描いた生き生きとした思索旅行記。',
  'ایک پرجوش سفر جو جامد حقائق پر مبنی سوچ سے تخیلاتی دریافت، تجسس اور تخلیقی ہمت کی طرف منتقلی کا احاطہ کرتا ہے۔',
  'একটি প্রাণবন্ত যাত্রা যা কাঠামোগত বাস্তবসম্মত চিন্তা থেকে কাল্পনিক আবিষ্কার, কৌতূহল এবং সৃজনশীল সাহসে রূপান্তরের সন্ধান করে।')

a('A lyrical anthological work celebrating romanticism, spiritual longing, and rhythm in the English language and classical verse forms.',
  'Una obra antológica lírica que celebra el romanticismo, el anhelo espiritual y el ritmo en la lengua inglesa y las formas poéticas clásicas.',
  'Une œuvre d\'anthologie lyrique célébrant le romantisme, l\'aspiration spirituelle et le rythme de la langue anglaise dans ses formes classiques.',
  'Ein lyrisches Anthologiewerk, das Romantik, spirituelle Sehnsucht und den Rhythmus der englischen Sprache in klassischen Versformen feiert.',
  '一部典雅的抒情诗集，颂扬浪漫主义、精神升华以及经典英文格律中独特的韵律与美感。',
  'عمل شعري غنائي يحتفي بالرومانسية والشوق الروحي والإيقاع الموسيقي للغة الإنجليزية وأشكال الشعر الكلاسيكي.',
  'एक गीतात्मक संकलन कार्य जो रूमानियत, आध्यात्मिक लालसा और अंग्रेजी भाषा और शास्त्रीय छंद रूपों में लय का जश्न मनाता है।',
  'Uma obra antológica lírica que celebra o romantismo, o anseio espiritual e o ritmo na língua inglesa e nas formas poéticas clássicas.',
  'Лирический поэтический сборник, воспевающий романтизм, духовное стремление и гармонию английского языка в классических стихотворных формах.',
  'ロマン主義、精神的渇望、そして英語の伝統的韻律形式が持つ美しいリズムを讃える叙情詩アンソロジー。',
  'ایک خوبصورت شعری مجموعہ جو رومانیت، روحانی تڑپ، اور انگریزی زبان اور کلاسیکی شاعری کی بحروں کے ردھم کو مناتا ہے۔',
  'একটি কাব্যিক সংকলন যা রোমান্টিকতা, আধ্যাত্মিক আকাঙ্ক্ষা এবং ইংরেজি ভাষা ও শাস্ত্রীয় কবিতার ছন্দের সৌন্দর্যকে প্রকাশ করে।')

a('Vocabino is maintained under Hamid Ali\'s autonomous academic stewardship, adhering strictly to Cambridge ESOL and IDP alignment criteria.',
  'Vocabino se mantiene bajo la tutela académica autónoma de Hamid Ali, adhiriéndose estrictamente a los criterios de alineación de Cambridge ESOL y el IDP.',
  'Vocabino est géré sous la direction académique autonome de Hamid Ali, en stricte conformité avec les critères de Cambridge ESOL et de l\'IDP.',
  'Vocabino wird unter der eigenverantwortlichen akademischen Leitung von Hamid Ali geführt und hält sich strikt an die Kriterien von Cambridge ESOL und IDP.',
  'Vocabino 始终在 Hamid Ali 的自主学术引领下独立运作，严格遵守剑桥ESOL与IDP雅思官方大纲对齐标准。',
  'تُدار منصة فوكابينو تحت الإشراف الأكاديمي المستقل لحامد علي، مع الالتزام التام بمعايير كامبريدج وIDP.',
  'वोकैबिनो हामिद अली की स्वायत्त अकादमिक देखरेख में बनाए रखा जाता है, जो कैम्ब्रिज ईएसओएल और आईडीपी संरेखण मानदंडों का सख्ती से पालन करता है।',
  'O Vocabino é mantido sob a tutela acadêmica autônoma de Hamid Ali, aderindo estritamente aos critérios de alinhamento de Cambridge ESOL e IDP.',
  'Vocabino поддерживается под независимым академическим руководством Хамида Али в строгом соответствии со стандартами Cambridge ESOL и IDP.',
  'Vocabinoは、ケンブリッジESOLおよびIDPの基準に厳格に準拠し、ハミド・アリの自律的な学術的指導のもとで維持・運営されています。',
  'ووکیبینو حامد علی کی خودمختار علمی رہنمائی میں چلایا جاتا ہے، جو کیمبرج اور IDP کے معیارات کی سختی سے پیروی کرتا ہے۔',
  'ভোকাবিনো হামিদ আলীর স্বায়ত্তশাসিত একাডেমিক তত্ত্বাবধানে পরিচালিত হয়, যা কেমব্রিজ ইএসওএল এবং আইডিপি সমন্বয় মানদণ্ড কঠোরভাবে মেনে চলে।')

print("Extra phrases defined:", len(EXTRA))
