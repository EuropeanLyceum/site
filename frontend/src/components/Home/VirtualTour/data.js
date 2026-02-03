import schoolPhoto from "../../../assets/photos/building/school.jpg";
import gymPhoto from "@/assets/photos/building/gym.jpg";
import danceHallPhoto from "@/assets/photos/building/dance_hall.jpg";
import foyerPhoto from "@/assets/photos/building/foyer.jpg";
import rimcPhoto from "@/assets/photos/building/rimc.jpg";
import libraryPhoto from "@/assets/photos/building/library.jpg";
import medRoomPhoto from "@/assets/photos/building/med_room.jpg";
import hallPhoto from "@/assets/photos/building/hall.jpg";
import teachRoomPhoto from "@/assets/photos/building/teach_room.jpg";
import compRoomPhoto from "@/assets/photos/building/comp_room.jpg";
import class2FloorPhoto from "@/assets/photos/building/class2floor.jpg";
import assemblyHallPhoto from "@/assets/photos/building/assembly_hall.jpg";
import assemblyHall2Photo from "@/assets/photos/building/assembly_hall2.jpg";
import canteenPhoto from "@/assets/photos/building/canteen.jpg";
import engClassPhoto from "@/assets/photos/building/eng_class.jpg";
import organizeRoomPhoto from "@/assets/photos/building/organize_room.jpg";
import primarySchool1Photo from "@/assets/photos/building/primary_school1.jpg";
import primarySchool2Photo from "@/assets/photos/building/primary_school2.jpg";
import engClass2Photo from "@/assets/photos/building/eng_class2.jpg";
import corridor31Photo from "@/assets/photos/building/corridor3.1.jpg";
import corridor32Photo from "@/assets/photos/building/corridor3.2.jpg";
import corridor33Photo from "@/assets/photos/building/corridor3.3.jpg";
import corridor34Photo from "@/assets/photos/building/corridor3.4.jpg";
import chemistryPhoto from "@/assets/photos/building/chemistry.jpg";
import physics1Photo from "@/assets/photos/building/physics1.jpg";
import physics2Photo from "@/assets/photos/building/physics2.jpg";
import biology1Photo from "@/assets/photos/building/biology1.jpg";
import biology2Photo from "@/assets/photos/building/biology2.jpg";
import yardPhoto from "@/assets/photos/building/yard.jpg";
import sportGroundPhoto from "@/assets/photos/building/sport_ground.jpg";

export const locations = {
    entrance: {
        name: "Головний вхід",
        description:
            "Ласкаво просимо до нашого ліцею! Тут кожен ранок починається наша навчальна подорож. Сучасний та затишний вхід створює приємне перше враження.",
        image: schoolPhoto.src,
        icon: icons.Home,
        connections: ["foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Сучасний дизайн фасаду",
            "Безпечний вхід з охороною",
        ],
    },
    foyer: {
        name: "Фойє та рецепція",
        description:
            "Центральне фойє - це серце нашої школи, де учні та відвідувачі отримують необхідну інформацію. Простора та світла зона для зустрічей.",
        image: foyerPhoto.src,
        icon: icons.Users,
        connections: ["entrance", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Адміністративна зона",
            "Зона очікування для батьків",
            "Доступ до шкільного двору",
        ],
    },
    rimc: {
        name: "РІМЦ",
        floor: "Нульовий поверх",
        description:
            "Ресурсний інформаційно-методичний центр - багатофункціональна кімната для проведення конференцій, семінарів та різноманітних освітніх заходів. Обладнана сучасною комп'ютерною технікою та великим телевізором для презентацій.",
        image: rimcPhoto.src,
        icon: icons.Computer,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Сучасні комп'ютери",
            "Великий телевізор для презентацій",
            "Конференц-зал для заходів",
        ],
    },
    library: {
        name: "Бібліотека",
        floor: "Нульовий поверх",
        description:
            "Сучасна шкільна бібліотека з великою колекцією книг та комп'ютерною зоною. Тихе місце для навчання та читання, де учні можуть поглибити свої знання.",
        image: libraryPhoto.src,
        icon: icons.Book,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Читальна зона",
            "Навчальна та художня література",
        ],
    },
    gym: {
        name: "Спортзал",
        floor: "Нульовий поверх",
        description:
            "Великий спортивний зал для уроків фізкультури та спортивних змагань. Простір для активного та здорового способу життя, де учні розвивають фізичні здібності.",
        image: gymPhoto.src,
        icon: icons.Dumbbell,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Баскетбольні та волейбольні сітки",
            "Різноманітний спортивний інвентар",
            "Роздягальні кімнати",
            "Безпечне покриття підлоги",
        ],
    },
    danceroom: {
        name: "Танцзал",
        floor: "Нульовий поверх",
        description:
            "Просторий танцювальний зал з дзеркальними стінами для хореографічних занять та творчого самовираження. Місце де учні розвивають пластику та артистизм.",
        image: danceHallPhoto.src,
        icon: icons.Dance,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Дзеркальні стіни",
            "Спеціальне танцювальне покриття",
            "Простір для групових занять",
        ],
    },
    medical: {
        name: "Медпункт",
        floor: "Нульовий поверх",
        description:
            "Медичний кабінет для надання першої допомоги та медичного обслуговування учнів. Забезпечує безпечне та здорове навчальне середовище.",
        image: medRoomPhoto.src,
        icon: icons.Medical,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Обладнання для першої допомоги",
            "Медичні препарати",
            "Кушетка для огляду",
            "Кваліфікований медпрацівник",
        ],
    },
    recreation: {
        name: "Рекреація",
        floor: "Перший поверх",
        description:
            "Світлий коридор першого поверху для короткого відпочинку між уроками. Простір із широкими проходами, зручними місцями для сидіння та приємною атмосферою.",
        image: hallPhoto.src,
        icon: icons.TeddyBear,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Природне освітлення",
            "Зручні місця для очікування",
            "Доступ до основних кабінетів",
        ],
    },
    classroom1: {
        name: "Кабінет початкової школи",
        floor: "Перший поверх",
        description:
            "Сучасний навчальний кабінет для учнів початкових класів, обладнаний інтерактивними засобами навчання та зручними меблями відповідно до віку дітей.",
        image: primarySchool1Photo.src,
        icon: icons.GraduationCap,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Меблі для початкової школи",
            "Безпечне середовище для навчання",
        ],
    },
    classroom2: {
        name: "Кабінет початкової школи",
        floor: "Перший поверх",
        description:
            "Навчальний кабінет для учнів початкових класів з сучасним обладнанням та комфортним освітнім середовищем для ефективного навчання.",
        image: primarySchool2Photo.src,
        icon: icons.Book,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Комфортні робочі місця",
            "Творча навчальна атмосфера",
        ],
    },
    teacherspace: {
        name: "Учительський простір",
        floor: "Другий поверх",
        description:
            "Спеціально обладнана зона для роботи та відпочинку вчителів. Комфортне місце для підготовки до уроків, планування та професійного спілкування.",
        image: teachRoomPhoto.src,
        icon: icons.Users,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Робочі місця для вчителів",
            "Зона для відпочинку",
            "Професійне спілкування",
        ],
    },
    computerclass: {
        name: "Комп'ютерний клас",
        floor: "Другий поверх",
        description:
            "Сучасний комп'ютерний клас з новітнім обладнанням для вивчення інформаційних технологій та цифрових навичок учнями різних вікових груп.",
        image: compRoomPhoto.src,
        icon: icons.Computer,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Сучасні комп'ютери",
            "Швидкісний інтернет",
            "Мультимедійне обладнання",
        ],
    },
    middleschool: {
        name: "Кабінет середньої школи",
        floor: "Другий поверх",
        description:
            "Універсальний навчальний кабінет для учнів середніх класів, призначений для проведення різноманітних предметних уроків та практичних занять.",
        image: class2FloorPhoto.src,
        icon: icons.GraduationCap,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Сучасне навчальне обладнання",
            "Гнучке планування простору",
            "Мультифункціональність",
        ],
    },
    auditorium: {
        name: "Актовий зал",
        description:
            "Просторий актовий зал для проведення урочистих заходів, концертів, театральних вистав та загальношкільних зборів. Оснащений сучасною звуковою та світловою апаратурою.",
        images: [assemblyHallPhoto.src, assemblyHall2Photo.src],
        icon: icons.Theater,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Сцена з професійним освітленням",
            "Якісна акустична система",
            "Місця для глядачів",
            "Технічне обладнання для заходів",
        ],
    },
    cafeteria: {
        name: "Шкільна їдальня",
        description:
            "Затишна їдальня з просторим обіднім залом та сучасною кухнею. Місце для здорового харчування учнів та персоналу протягом навчального дня.",
        image: canteenPhoto.src,
        icon: icons.Restaurant,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Сучасна кухня",
            "Здорове та смачне харчування",
            "Просторий обідній зал",
        ],
    },
    orgoffice: {
        name: "Організаційний кабінет",
        description:
            "Адміністративний кабінет для координації організаційних питань ліцею. Центр планування навчальних процесів та управління внутрішніми справами закладу.",
        image: organizeRoomPhoto.src,
        icon: icons.Office,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Робочі місця адміністрації",
            "Документообіг та планування",
            "Координація навчальних процесів",
        ],
    },
    languageroom: {
        name: "Кабінет іноземної мови",
        description:
            "Спеціалізований кабінет для вивчення іноземних мов з інтерактивними засобами навчання. Створює мовне середовище для ефективного вивчення англійської, німецької та інших мов.",
        image: engClassPhoto.src,
        icon: icons.Language,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Інтерактивні мовні програми",
            "Аудіо та відео матеріали",
            "Комунікативні методики навчання",
            "Мультимедійне обладнання",
        ],
    },
    hallway3: {
        name: "Коридори третього поверху",
        floor: "Третій поверх",
        description:
            "Просторий коридор третього поверху з природним освітленням та зоною для відпочинку з мішками для сидіння. Центральна зона для переміщення між спеціалізованими науковими кабінетами та навчальними приміщеннями. Стіни прикрашені художніми елементами, створюючи приємну та надихаючу атмосферу для учнів.",
        images: [corridor31Photo.src, corridor32Photo.src, corridor33Photo.src, corridor34Photo.src],
        icon: icons.Hallway,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Природне освітлення",
            "Зона для відпочинку з мішками для сидіння",
            "Художнє оформлення стін",
            "Доступ до наукових кабінетів",
            "Простір для переміщення",
        ],
    },
    chemistry: {
        name: "Кабінет хімії",
        floor: "Третій поверх",
        description:
            "Спеціально обладнаний хімічний кабінет з лабораторією для проведення практичних занять та експериментів. Безпечне середовище для вивчення хімічних процесів.",
        image: chemistryPhoto.src,
        icon: icons.Chemistry,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Лабораторне обладнання",
            "Хімічні реактиви",
            "Безпечні робочі місця",
        ],
    },
    biology: {
        name: "Кабінет біології",
        floor: "Третій поверх",
        description:
            "Кабінет біології з мікроскопами та навчальними матеріалами для вивчення живої природи. Оснащений сучасним обладнанням для дослідження біологічних процесів.",
        images: [biology1Photo.src, biology2Photo.src],
        icon: icons.Biology,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Мікроскопи та лупи",
            "Гербарій та колекції",
            "Моделі органів та систем",
        ],
    },
    physics: {
        name: "Кабінет фізики",
        floor: "Третій поверх",
        description:
            "Фізичний кабінет з демонстраційним обладнанням для вивчення законів природи. Лабораторія для проведення фізичних експериментів та досліджень.",
        images: [physics1Photo.src, physics2Photo.src],
        icon: icons.Physics,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Демонстраційне обладнання",
            "Електричні схеми",
            "Оптичні прилади",
            "Механічні моделі",
        ],
    },
    languageroom3: {
        name: "Кабінет іноземної мови",
        floor: "Третій поверх",
        description:
            "Додатковий кабінет іноземної мови третього поверху. Обладнаний сучасними технологіями для ефективного вивчення мов.",
        image: engClass2Photo.src,
        icon: icons.Language,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Інтерактивні панелі",
            "Аудіо система",
            "Мовні програми",
            "Групова робота",
        ],
    },
    playground: {
        name: "Шкільний майданчик",
        description:
            "Просторий спортивний майданчик на свіжому повітрі для активних ігор та занять фізкультурою. Включає футбольне поле, баскетбольні кільця та зони для різноманітних спортивних активностей.",
        image: sportGroundPhoto.src,
        icon: icons.Playground,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Футбольне поле",
            "Баскетбольні кільця",
            "Спортивні тренажери",
            "Зона для групових ігор",
        ],
    },
    courtyard: {
        name: "Внутрішній дворик",
        description:
            "Затишний внутрішній дворик з зеленими насадженнями та місцями для відпочинку. Тихе місце для роздумів, читання або неформального спілкування в природному оточенні.",
        image: yardPhoto.src,
        icon: icons.Courtyard,
        connections: ["entrance", "foyer", "rimc", "library", "gym", "danceroom", "medical", "recreation", "classroom1", "classroom2", "teacherspace", "computerclass", "middleschool", "auditorium", "cafeteria", "orgoffice", "languageroom", "hallway3", "chemistry", "biology", "physics", "languageroom3", "playground", "courtyard"],
        highlights: [
            "Зелені насадження",
            "Альтанка для відпочинку",
            "Тиша та спокій",
            "Природне середовище",
        ],
    },
};