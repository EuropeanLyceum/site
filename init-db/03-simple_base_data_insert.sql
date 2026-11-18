INSERT INTO "FAQ" ("questionUk", "questionEn", "answerUk", "answerEn", "order")
VALUES
    (
        'Скільки змін навчання в ліцеї?',
        'How many shifts of learning are there in the lyceum?',
        '3, 4, 5 класи навчаються в другу зміну. Решта паралелей — в першу.',
        'Grades 3, 4, 5 study in the second shift. The rest of the parallels study in the first shift.',
        1
    ),
    (
        'Який формат навчання у вашому закладі?',
        'What is the learning format at your institution?',
        'Усі класи, крім 6 і 7 знаходяться на офлайн навчанні, відвідуючи школу щодня. Паралелі 6-7 класів — на змішаному. Вони ходять до школи через день.',
        'All classes except 6th and 7th are in offline learning, attending school daily. Grades 6-7 are on mixed format. They attend school every other day.',
        2
    ),
    (
        'Чи є у вас в ліцеї шкільна форма?',
        'Do you have a school uniform in the lyceum?',
        'Ні, але вітається офіційний стиль одягу.',
        'No, but formal style of clothing is welcome.',
        3
    ),
    (
        'Які іноземні мови у вас вивчаються?',
        'What foreign languages do you have?',
        'Перша іноземна мова — англійська, друга іноземна — німецька, яка вивчається з 5 по 9 клас.',
        'The first foreign language is English, the second foreign language is German, which is studied from grades 5 to 9.',
        4
    ),
    (
        'Які профілі навчання пропонуються в десятих класах?',
        'What learning profiles are offered in tenth grades?',
        'Іноземна філологія, українська філологія, історичний профіль, математичний, хіміко-біологічний, фізико-математичний.',
        'Foreign philology, Ukrainian philology, historical profile, mathematical, chemical-biological, physical-mathematical.',
        5
    ),
    (
        'Які гуртки пропонує ваш навчальний заклад?',
        'What clubs does your educational institution offer?',
        'Вокал, хореографія, спортивні секції, театральна студія, художній гурток.',
        'Vocals, choreography, sports sections, theater studio, art club.',
        6
    ),
    (
        'Чи проводиться набір у 5ті класи?',
        'Is there enrollment for 5th grades?',
        'Так. Починаючи з 5-го класу буде реалізуватися допрофільне навчання з англійської мови та математики.',
        'Yes. Starting from 5th grade, pre-profile education in English and mathematics will be implemented.',
        7
    ),
    (
        'Який режим роботи закладу під час повітряної тривоги?',
        'What is the institution''s operating mode during air raids?',
        'Уроки продовжуються в безпечному місці.',
        'Lessons continue in a safe place.',
        8
    );

INSERT INTO "PageSection" (
    "type",
    "titleUk",
    "titleEn",
    "contentUk",
    "contentEn"
)
VALUES (
           'HOME_HERO',
           'Ласкаво просимо!',
           'Welcome!',
           'Якщо Ви шукаєте друзів і партнерів, цікавитеся системою освіти в Україні та хочете переконатися, як вона діє на практиці, маєте бажання віртуально повернутися в дитинство чи поспілкуватися зі своїми вчителями, поділитися життєвими надбаннями, дати добру пораду чи отримати її, або ж намірилися надати нашому ліцею спонсорську допомогу, ласкаво запрошуємо на наш офіційний сайт.

       Сайт дасть Вам детальну інформацію про

       • життя та історію ліцею;
       • педагогічний колектив;
       • досягнення учнів у навчанні, олімпіадах та різноманітних конкурсах;
       • новини та традиції буднів і свят — усе те, що діється в ліцеї та інше.

       Сподiваємося, Вам буде цiкаво познайомитися з життям нашого рідного ліцею, ми станемо друзями i Ви будете нашими постiйними відвідувачами.',
           'If you are looking for friends and partners, interested in the education system in Ukraine and want to see how it works in practice, wish to virtually return to childhood or communicate with your teachers, share life achievements, give good advice or receive it, or intend to provide sponsorship support to our lyceum, we warmly invite you to our official website.

       The website will give you detailed information about

       • life and history of the lyceum;
       • teaching staff;
       • student achievements in studies, olympiads and various competitions;
       • news and traditions of weekdays and holidays — everything that happens in the lyceum and more.

       We hope you will be interested in getting to know the life of our native lyceum, we will become friends and you will be our regular visitors.'
       );

INSERT INTO "LyceumStats" (
    "id",
    "name",
    "nameEn",
    "addressUk",
    "addressEn",
    "email",
    "phone",
    "logoPhoto",
    "quoteUk",
    "quoteEn",
    "teachingLanguage",
    "teachingLanguageEn",
    "specialization",
    "specializationEn",
    "anthemUrl",
    "teachersPhoto",
    "materialBasePhoto",
    "materialBaseDescriptionUk",
    "materialBaseDescriptionEn",
    "studentsCount",
    "studentsCountReal",
    "teachersCount",
    "staffCount",
    "classesCount"
) VALUES (
             1,
             'The Sun City (Місто Сонця)',
             'The Sun City',
             'вул. Монастирська, 36, м. Лубни Полтавської області, 37500',
             '36 Monastyrska St., Lubny, Poltava region, 37500',
             'schoolsuncity@ukr.net',
             '0536170838',
             '/images/logo.png', -- Замініть на реальний шлях до файлу
             'Наші знання - на користь Україні',
             'Our knowledge - for Ukraine''s benefit',
             'Українська',
             'Ukrainian',
             'Поглиблене вивчення англійської мови',
             'In-depth study of the English language',
             'https://example.com/anthem-link', -- Замініть на реальне посилання
             '', -- Замініть на реальний шлях до файлу
             '/images/material_base.jpg', -- Замініть на реальний шлях до файлу
             'Ліцей має триповерхову будівлю: 26 класних кімнат і навчальних аудиторій; 10 кабінетів англійської мови; сучасні обладнані кабінети інформатики, фізики, хімії, біології, математики, географії; ресурсний інформаційно-методичний центр; спортивний, актовий і танцювальний зали; учительський мультимедійний методичний центр.',
             'The lyceum has a three-story building: 26 classrooms and educational auditoriums; 10 English language cabinets; modern equipped cabinets for computer science, physics, chemistry, biology, mathematics, geography; resource information-methodical center; sports, assembly and dance halls; teacher multimedia methodical center.',
             712, -- Ліцензований обсяг
             780, -- Фактична кількість
             62,
             89,
             32
         )
    ON CONFLICT (id) DO UPDATE SET
    "name" = EXCLUDED."name",
                            "nameEn" = EXCLUDED."nameEn",
                            "addressUk" = EXCLUDED."addressUk",
                            "addressEn" = EXCLUDED."addressEn",
                            "email" = EXCLUDED."email",
                            "phone" = EXCLUDED."phone",
                            "quoteUk" = EXCLUDED."quoteUk",
                            "quoteEn" = EXCLUDED."quoteEn",
                            "teachingLanguage" = EXCLUDED."teachingLanguage",
                            "teachingLanguageEn" = EXCLUDED."teachingLanguageEn",
                            "specialization" = EXCLUDED."specialization",
                            "specializationEn" = EXCLUDED."specializationEn",
                            "materialBaseDescriptionUk" = EXCLUDED."materialBaseDescriptionUk",
                            "materialBaseDescriptionEn" = EXCLUDED."materialBaseDescriptionEn",
                            "studentsCount" = EXCLUDED."studentsCount",
                            "studentsCountReal" = EXCLUDED."studentsCountReal",
                            "teachersCount" = EXCLUDED."teachersCount",
                            "staffCount" = EXCLUDED."staffCount",
                            "classesCount" = EXCLUDED."classesCount",
                            "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "Clubs" ("nameUk", "nameEn", "descriptionUk", "descriptionEn", "order")
VALUES
    (
        '«Дивосвіт»', '«Divosvit»',
        'Наукове товариство', 'Scientific society',
        1
    ),
    (
        '«LINK»', '«LINK»',
        'Європейський клуб', 'European club',
        2
    ),
    (
        '«Дивоцвіт»', '«Divotsvit»',
        'Студія образотворчого мистецтва', 'Visual arts studio',
        3
    ),
    (
        '«Валері»', '«Valeri»',
        'Вокальний ансамбль', 'Vocal ensemble',
        4
    ),
    (
        '«Карден»', '«Karden»',
        'Танцювальний колектив', 'Dance group',
        5
    );

INSERT INTO "WorkingArea" ("nameUk", "nameEn", "order")
VALUES
    ('вул. Вишневецьких', 'Vyshnevetskykh St.', 1),
    ('вул. Монастирська', 'Monastyrska St.', 2),
    ('вул. Кузні', 'Kuzni St.', 3),
    ('вул. Євгенія Чикаленка з І і ІІ провулками', 'Yevhen Chykalenko St. with 1st and 2nd lanes', 4),
    ('вул. Грушевського', 'Hrushevskyi St.', 5),
    ('вул. Петра Лубенського', 'Petro Lubenskyi St.', 6),
    ('вул. Свободи', 'Svobody St.', 7),
    ('вул. Ботанічна', 'Botanichna St.', 8),
    ('вул. Андрія Жука з тупиком', 'Andrii Zhuka St. with dead end', 9);

INSERT INTO "Content" ("type", "slug", "titleUk", "titleEn", "textUk", "textEn")
VALUES
    (
        'FOUNDERS',
        'history-founders',
        'Фундатори',
        'Founders',
        'Школа №6 була заснована в 1947 р. на базі СШ №3, новий заклад очолив Оранський Яків Олександрович. Узято вісім початкових класів разом з такими вчителями: Личко Лідія Олексіївна, Фролова Лідія Василівна, Мілікова Надія Микитівна, Борисенко Олександра Данилівна, Оранська Марія Миколаївна, Новікова Марія Олександрівна, Панченко Єлизавета Миколаївна.

    Також із середньої школи №3 до семирічної школи №6 було переведено 5-ті, 6-ті та 7-мі класи з такими вчителями: Шепелем Яковом Михайловичем (вчитель фізики), Бакановою Лідією Іванівною (вчитель російської мови та літератури), Бабенко Зінаїдою Григорівною (вчитель математики), Гаврюком Андрієм Івановичем (вчитель математики), Нестеренком Федором Микитовичем (вчитель української мови).

    Значний внесок у становлення та розбудову школи зробили вчителі: Криворотько Зоя Іванівна, Лугова Людмила Василівна, Ніканорова Надія Степанівна, Зайцева Віра Іванівна, Десятун Марія Іванівна, Мірошніченко Юлія Миколаївна, які в різні часи були нагороджені почесними вчительськими званнями. Яскраву сторінку в історію школи вписав своєю педагогічною діяльністю видатний український письменник Малик (Січенко) Володимир Кирилович, який у 60-тих роках викладав українську мову та літературу.

    У 1959 році заступником директора була призначена Попова Валентина Федорівна. Після неї на цій посаді був Шепель Яків Михайлович, а через деякий час Козлов Леонід Данилович. Посаду заступника директора по початковій школі обіймав Горбенко Іван Іванович, а згодом Баканова Лідія Іванівна, яку змінила Сірченко Світлана Олексіївна.',
        'School No. 6 was founded in 1947 on the basis of Secondary School No. 3, with Yakiv O. Oranskyi heading the new institution. Eight elementary classes were taken along with teachers: Lidia O. Lychko, Lidia V. Frolova, Nadiya M. Milikova, Oleksandra D. Borysenko, Maria M. Oranska, Maria O. Novikova, Yelyzaveta M. Panchenko.

    Also from Secondary School No. 3 to seven-year School No. 6, 5th, 6th, and 7th grades were transferred with teachers: Yakov M. Shepel (physics teacher), Lidia I. Bakanova (Russian language and literature teacher), Zinaida H. Babenko (mathematics teacher), Andriy I. Havryuk (mathematics teacher), Fedor M. Nesterenko (Ukrainian language teacher).

    Significant contribution to the establishment and development of the school was made by teachers: Zoya I. Kryvorotko, Lyudmyla V. Luhova, Nadiya S. Nikanorova, Vira I. Zaitseva, Maria I. Desyatun, Yulia M. Miroshnychenko, who at different times were awarded honorary teaching titles. A bright page in the school''s history was written by the outstanding Ukrainian writer Volodymyr K. Malyk (Sichenko), who taught Ukrainian language and literature in the 1960s.

    In 1959, Valentyna F. Popova was appointed deputy director. After her, Yakov M. Shepel held this position, and some time later Leonid D. Kozlov. The position of deputy director for elementary school was held by Ivan I. Horbenko, and later Lidia I. Bakanova, who was replaced by Svitlana O. Sirchenko.'
    ),
    (
        'BUILDING',
        'school-building',
        'Будівля школи',
        'School building',
        'Спочатку школа №6 була розташована в одноповерховому будинку по вулиці Лисенка (сьогодні тут знаходиться Лубенська художня школа). Приміщення школи розбудовувалося в роки, коли її очолював Сахно Володимир Іванович, а заступником директора був Горбенко Іван Іванович. У 1967 році по вулиці Карла Маркса зведено нове приміщення для навчання.

    Організацією будівництва займалася директор школи Чабаненко Олександра Іванівна за активної підтримки всього педагогічного, батьківського й учнівського колективів. Держава відзначила її працю орденом Трудового Червоного Прапора. Особливий ентузіазм виявили вчителі праці Бабич Костянтин Володимирович, Баранов Микола Іванович, Кулініч Микола Олександрович, технічний працівник школи Балацький Петро Трохимович, учителі фізкультури та початкової військової підготовки Зозуля Олексій Іванович та Сластьон Петро Никифорович.

    З 2005 року – Лубенська спеціалізована школа І-ІІІ ступенів №6 Лубенської міської ради.',
        'Initially, School No. 6 was located in a one-story building on Lysenka Street (today the Lubny Art School is located here). The school premises were expanded during the years when Volodymyr I. Sakhno headed it, and Ivan I. Horbenko was deputy director. In 1967, a new building for education was built on Karl Marx Street.

    The organization of construction was handled by school director Oleksandra I. Chabanenko with the active support of the entire teaching, parental, and student staff. The state recognized her work with the Order of the Red Banner of Labor. Special enthusiasm was shown by labor teachers: Kostyantyn V. Babych, Mykola I. Baranov, Mykola O. Kulynych, school technical worker Petro T. Balatsky, physical education and initial military training teachers: Oleksiy I. Zozulya and Petro N. Slastion.

    Since 2005 – Lubny Specialized School I-III levels No. 6 of Lubny City Council.'
    ),
    (
        'HISTORY',
        'development-stages',
        'Етапи розвитку',
        'Development stages',
        'Школа №6 була заснована на базі середньої школи №3, як семирічна з російською мовою навчання в 1949-1950 навчальному році. З моменту свого заснування Лубенська спеціалізована школа №6 декілька разів змінювала свою назву. На підставі наказу Полтавського обласного відділу народної освіти під №254 від 26 серпня 1957 року семирічна школа №6 стала середньою школою №6 з російською мовою викладання. У 1960 році школа знову змінила назву: середня загальноосвітня трудова, політехнічна школа №6. А з 1963 року – середня загальноосвітня трудова, політехнічна школа №6 з виробничим навчанням. Найяскравіші сторінки того часу – участь учнів і вчителів у операції «Пошук».

    З 1967 року в школі з''явилася нова традиція: Осінні бали. Їх започаткувала Бова Лідія Олексіївна, на той назвавши «Літературна вітальня». У 1968 році середню школу №6 закінчили перші два 11 класи. У 1972 році навчальний заклад отримав назву – середня загальноосвітня школа №6 з поглибленим вивченням англійської мови.

    З 1975 року в школі існує кафедра англійської мови. З 1995 року – школа-ліцей №6 з поглибленим вивченням англійської мови. Щорічно учні – фіналісти міжурядової програми Американських Рад у галузі міжнародної освіти «Акт у підтримку свободи» та отримують право навчатись в американських школах протягом року. Школа-ліцей співпрацювала з фізичним факультетом КНУ ім. Т.Г. Шевченка та іншими провідними ВНЗ.',
        'School No. 6 was founded on the basis of Secondary School No. 3 as a seven-year school with Russian as the language of instruction in the 1949-1950 academic year. Based on the order of the Poltava Regional Department of Public Education No. 254 of August 26, 1957, the seven-year School No. 6 became Secondary School No. 6 with Russian as the language of instruction. In 1960, the school changed its name again: secondary general education labor, polytechnic school No. 6. And from 1963 – secondary general education labor, polytechnic school No. 6 with production training.

    Since 1967, a new tradition appeared at the school: Autumn Balls. They were initiated by Lidia O. Bova, calling them ''Literary Salon''. In 1968, the first two 11th grades graduated. In 1972, the educational institution received the name – secondary general education school No. 6 with in-depth study of English.

    Since 1975, an English language department has existed at the school. Since 1995 – school-lyceum No. 6 with in-depth study of English. Annually, students – finalists of the intergovernmental program of American Councils in the field of international education ''Freedom Support Act'' receive the right to study in American schools for a year. The school-lyceum collaborated with the Physics Faculty of Taras Shevchenko Kyiv National University and other leading universities.'
    );

INSERT INTO "Person" ("fullNameUk", "fullNameEn", "positionUk", "positionEn", "descriptionUk", "descriptionEn", "type", "order")
VALUES
    ('Оранський Яків Олександрович', 'Yakiv O. Oranskyi', '1-й директор школи', '1st school director', 'У 1949-1950 навчальному році школу очолив Оранський Яків Олександрович – він став першим директором школи №6.', 'In the 1949-1950 academic year, Yakiv O. Oranskyi headed the school – he became the first director of School No. 6.', 'PRINCIPALS', 1),
    ('Бондар Михайло Сергійович', 'Mykhailo S. Bondar', '2-й директор школи', '2nd school director', '', '', 'PRINCIPALS', 2),
    ('Сахно Володимир Іванович', 'Volodymyr I. Sakhno', '3-й директор школи', '3rd school director', '', '', 'PRINCIPALS', 3),
    ('Чабаненко Олександра Іванівна', 'Oleksandra I. Chabanenko', '4-й директор школи', '4th school director', '', '', 'PRINCIPALS', 4),
    ('Клюшніченко Микола Степанович', 'Mykola S. Klyushnichenko', '5-й директор школи', '5th school director', '', '', 'PRINCIPALS', 5),
    ('Ткаченко Володимир Іванович', 'Volodymyr I. Tkachenko', '6-й директор школи', '6th school director', '', '', 'PRINCIPALS', 6),
    ('Рогожа Михайло Миколайович', 'Mykhailo M. Rohozha', '7-й директор школи', '7th school director', '', '', 'PRINCIPALS', 7),
    ('Нікітенко Микола Михайлович', 'Mykola M. Nikitenko', '8-й директор школи', '8th school director', '', '', 'PRINCIPALS', 8),
    ('Дмитренко Василь Едуардович', 'Vasyl E. Dmytrenko', '9-й директор школи', '9th school director', '', '', 'PRINCIPALS', 9),
    ('Кочергіна Світлана Олександрівна', 'Svitlana O. Kochergina', '10-й директор школи', '10th school director', '', '', 'PRINCIPALS', 10),
    ('Деркач Лариса Анатоліївна', 'Larysa A. Derkach', 'Директор ліцею', 'Current Director', 'Зараз директор Академічного ліцею "Європейський"', 'Currently director of the Academic Lyceum "European"', 'PRINCIPALS', 11);

INSERT INTO "Person" (
    "fullNameUk",
    "fullNameEn",
    "positionUk",
    "positionEn",
    "descriptionUk",
    "descriptionEn",
    "type",
    "order"
)
VALUES
    (
        'Дрібна Надія Микитівна',
        'Nadiya M. Dribna',
        'Вчитель-методист, вчитель-наставник',
        'Teacher-methodologist, teacher-mentor',
        'Дрібна Н.М. народилася 8 квітня 1929 року в м. Лубни. Після закінчення школи із золотою медаллю вступила до Київського державного педагогічного інституту іноземних мов. З 1953 року Надія Микитівна працювала в Лубенській середній школі №3 (спочатку вчителем англійської мови, потім заступником з навчально-виховної роботи, директором).

    У 1973 році її призначено інспектором міського відділу освіти, а з 1975 року – заступником директора з навчально-виховної роботи з англійської мови середньої школи №6. Саме з іменем Надії Микитівни пов`язують запровадження поглибленого вивчення англійської мови в м. Лубни. 18 років вона керувала роботою кафедри іноземних мов. Упродовж 25 років Надія Микитівна очолювала методичне об`єднання вчителів іноземних мов Лубенського району та міста.

    Як депутат міської ради двох скликань Надія Микитівна очолювала комісію по роботі з молоддю та комісію з народної освіти. Протягом 10 років працювала секретарем комісії з нових обрядів міськвиконкому й проводила реєстрацію шлюбів, два роки була секретарем міської ради по роботі з неповнолітніми.

    За активну й плідну громадську та педагогічну діяльність Дрібній Н. М. було присвоєно звання вчителя-методиста й учителя-наставника. Померла Надія Микитівна 1 червня 2010 року, похована в Лубнах. Нагороджена: орденом «Знак Пошани»; знаком «Відмінник освіти України»; медаллю «Ветеран праці».',
        'Nadiya M. Dribna was born on April 8, 1929 in Lubny. After graduating from school with a gold medal, she entered the Kyiv State Pedagogical Institute of Foreign Languages. Since 1953, Nadiya Mykytivna worked at Lubny Secondary School No. 3.

    In 1973, she was appointed inspector of the city education department, and from 1975 – deputy director for educational work in English at Secondary School No. 6. It is with the name of Nadiya Mykytivna that the introduction of in-depth study of English in Lubny is associated. For 18 years, she managed the work of the foreign languages department.

    As a deputy of the city council for two convocations, Nadiya Mykytivna headed the commission for work with youth and the commission for public education. For 10 years, she worked as secretary of the commission for new rituals of the city executive committee and conducted marriage registrations, for two years she was secretary of the city council for work with minors.

    For active and fruitful public and pedagogical activity, Nadiya M. Dribna was awarded the title of teacher-methodologist and teacher-mentor. Nadiya Mykytivna died on June 1, 2010, and was buried in Lubny. Awarded: Order of ''Badge of Honor''; ''Excellence in Education of Ukraine'' badge; ''Veteran of Labor'' medal.',
        'FAMOUS_PERSON',
        1
    ),
    (
        'Капішевська Фаїна Федорівна',
        'Faina F. Kapishevska',
        'Заслужений учитель України',
        'Honored Teacher of Ukraine',
        'Народилася 1 березня 1943 року поблизу міста Курган (Росія). Після закінчення середньої школи вступила до Курганівського педагогічного інституту, де здобула фах – учитель історії та російської мови.

    З 1972 року працювала в школі №6 спочатку на посаді старшої піонервожатої по роботі з комсомолом і вчителем російської мови та літератури, потім організатором позакласної та позашкільної роботи, а з 1980 року заступником директора з навчально-виховної роботи.

    У 1988 році Фаїні Федорівні було присвоєно звання Заслуженого учителя України, вона стала делегатом Всесоюзного з`їзду вчителів, де зустрічалася з такими великими педагогами, як Шаталов, Амонашвілі, Лисенкова, Хазанкін, Ільїн. Також Капішевську Ф.Ф. було нагороджено медаллю Макаренка.

    Посаду заступника директора з навчально-виховної роботи Фаїна Федорівна обіймала до 2005 року. З 2005 року по 2007 рік працювала вчителем історії.',
        'She was born on March 1, 1943, near the city of Kurgan (Russia). After graduating from secondary school, she entered Kurgan Pedagogical Institute, where she received her specialty – teacher of history and Russian language.

    Since 1972, she worked at School No. 6, first as senior pioneer leader for work with Komsomol and teacher of Russian language and literature, then as organizer of extracurricular and out-of-school work, and from 1980 as deputy director for educational work.

    In 1988, Faina Fedorivna was awarded the title of Honored Teacher of Ukraine, she became a delegate to the All-Union Congress of Teachers, where she met with such great educators as Shatalov, Amonashvili, Lysenkova, Khazankin, Ilyin. Faina F. Kapishevska was also awarded the Makarenko medal.

    Faina Fedorivna held the position of deputy director for educational work until 2005. From 2005 to 2007, she worked as a history teacher.',
        'FAMOUS_PERSON',
        2
    ),
    (
        'Бова Лідія Олексіївна',
        'Lidia O. Bova',
        'Учитель-методист, учитель вищої категорії',
        'Teacher-methodologist, teacher of the highest category',
        'Бова Л.О. – учитель-методист, учитель вищої категорії. Прийшла в школу в 1967 році на посаду організатора позакласної та позашкільної роботи.

    Започаткувала таку форму виховної роботи з естетичного та морального виховання учнів, як Літературна вітальня. Вечори з життя українських та зарубіжних письменників стали традиційними в школі. Ініціювала створення пошукового загону, що дослідив бойовий шлях 337 стрілкової дивізії. Організовувала та проводила військово-спортивні змагання «Зірниця».

    З 1985 року перейшла на посаду вчителя російської мови та зарубіжної літератури. Із 36 учнів класу, де вона була класним керівником, 23 випускники були нагороджені золотими та срібними медалями.

    Усі учні продовжили навчання у вищих навчальних закладах України та США. 48 років Лідія Олексіївна віддала навчанню та вихованню дітей, з них 41 рік - Лубенській спеціалізованій школі №6.',
        'Lidia O. Bova – teacher-methodologist, teacher of the highest category. She came to the school in 1967 as an organizer of extracurricular and out-of-school work.

    She initiated such a form of educational work for aesthetic and moral education of students as Literary Salon. Evenings about the life of Ukrainian and foreign writers became traditional at the school. She initiated the creation of a search squad that researched the combat path of the 337th Rifle Division. She organized and conducted military-sports competitions ''Zirnytsia''.

    Since 1985, she moved to the position of teacher of Russian language and foreign literature. Of the 36 students in the class where she was a class teacher, 23 graduates were awarded gold and silver medals.

    All students continued their education at higher educational institutions in Ukraine and the USA. For 48 years, Lidia Oleksiyivna devoted herself to teaching and educating children, 41 of which were at Lubny Specialized School No. 6.',
        'FAMOUS_PERSON',
        3
    ),
    (
        'Ворожбит Ніна Миколаївна',
        'Nina M. Vorozhbyt',
        'Заслужений учитель України, вчитель-методист',
        'Honored Teacher of Ukraine, teacher-methodologist',
        'Ворожбит Н.М. народилася 29 березня 1947 року в с. Шамраївка. У 1970 р. закінчила механіко-математичний факультет Львівського державного університету ім. Івана Франка.

    З 1970 р. працювала інженером-програмістом, економістом, віце-президентом з маркетингу та фінансів. З 2000 р. – викладач економічних дисциплін та учитель економіки в ЛСШ №6.

    За період роботи в школі з 2000 по 2015 рр. підготувала 56 призерів і 12 переможців обласних етапів олімпіад з економіки та 30 переможців і призерів конкурсу-захисту МАН. Призерами України на олімпіадах стали 8 учнів і 14 – на Всеукраїнському конкурсі-захисті МАН.

    Четверо учнів отримали стипендію Президента України: Когтєв Максим, Сиркіна Юлія, Мацур Сергій та Білан Максим. У 2013 р. була удостоєна звання «Заслужений учитель України».',
        'Nina M. Vorozhbyt was born on March 29, 1947. In 1970, she graduated from the Faculty of Mechanics and Mathematics of Ivan Franko Lviv State University.

    From 1970, she worked as a programmer engineer, economist, head of the planning department, vice president for marketing and finance. Since 2000 – economics teacher at Lubny Specialized School No. 6.

    During the period of work at the school from 2000 to 2015, she prepared 56 prize-winners and 12 winners of III (regional) stages of economics olympiads and 30 winners and prize-winners of II (regional) stage of the competition-defense of the Small Academy of Sciences.

    Four students received the President of Ukraine scholarship: Kohtev Maksym, Syrkina Yulia, Matsur Serhiy, and Bilan Maksym. In 2013, she was awarded the title ''Honored Teacher of Ukraine''.',
        'FAMOUS_PERSON',
        4
    ),
    (
        'Кочергіна Світлана Олександрівна',
        'Svitlana O. Kochergina',
        'Екс-директор, вчитель англійської мови',
        'Former director, English teacher',
        'Трудовий шлях розпочався 15 серпня 1987 року. З 2009 по 2016 р. була директором Лубенської спеціалізованої школи №6.

    У 1997 посіла І місце на обласному етапі конкурсу «Учитель року» в номінації «Англійська мова» та стала лауреатом Всеукраїнського етапу. У 1999 році стажувалася в університеті штату Монтана (США), була учасником міжнародної конференції «EnglishAcrossCultures», координатором міжнародної програми e-Twinning.

    Світлана Олександрівна неодноразово була переможцем всеукраїнського конкурсу «Панорама творчих уроків», її методичні розробки публікувалися у фахових періодичних виданнях.

    За багаторічну сумлінну працю нагороджена Почесною грамотою МОН України (2007 р.), Грамотою посольства США (1999, 2000 рр.), Почесною грамотою Кабінету Міністрів України (2013 р.).',
        'Svitlana O. Kochergina''s career path began on August 15, 1987. From 2009 to 2016 she was director of Lubny Specialized School No. 6.

    In 1997, she took 1st place at the regional stage of the ''Teacher of the Year'' competition and became a laureate of the All-Ukrainian stage (2nd place). In 1999, she interned at the University of Montana (USA), was a participant in the international conference ''EnglishAcrossCultures'', coordinator of the international e-Twinning program.

    Svitlana Oleksandrivna repeatedly won the All-Ukrainian competition ''Panorama of Creative Lessons''.

    Awarded the Honorary Certificate of the Ministry of Education and Science of Ukraine (2007), Certificate of the US Embassy (1999, 2000), Honorary Certificate of the Cabinet of Ministers of Ukraine (2013).',
        'FAMOUS_PERSON',
        5
    );