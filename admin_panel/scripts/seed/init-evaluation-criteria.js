const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Початок ініціалізації критеріїв оцінювання...');

  // Очищаємо існуючі дані
  await prisma.evaluationCriteria.deleteMany({});
  console.log('🗑️ Видалено існуючі критерії');

  // Створюємо початкові критерії
  const initialCriteria = [
    {
      name: 'Англійська мова',
      url: 'https://drive.google.com/file/d/1gtE7kr_3CYjAxp5wbhmBAO-tHT4UQHIj/view',
      color: '#FF6B6B',
      hasSubItems: false,
      subItems: [],
      order: 1
    },
    {
      name: 'Біологія',
      url: 'https://drive.google.com/file/d/1eV-u6r_xAmWqsQv3etB4UqrgLYLrjHTW/view',
      color: '#4ECDC4',
      hasSubItems: false,
      subItems: [],
      order: 2
    },
    {
      name: 'Географія',
      url: null,
      color: '#45B7D1',
      hasSubItems: true,
      subItems: [
        { name: '6 клас', link: 'https://docs.google.com/document/d/1-9qCQxRe8uUdJg4RQYtFmyQSRq1Bs4cX/edit?tab=t.0' },
        { name: '7 клас', link: 'https://docs.google.com/document/d/1iqUv1RGSmjd861C8YvnPb8heE9OKJ-xb/edit?tab=t.0' },
        { name: '8 клас', link: 'https://docs.google.com/document/d/1q-OCyEWfrQyOdmpNbl3a35R7o6XeqgTD/edit?tab=t.0' },
        { name: '9 клас', link: 'https://docs.google.com/document/d/1cTpJaXdA83TIunJgEXTCl32BoHEiC_i8/edit?tab=t.0' },
        { name: '10 клас', link: 'https://docs.google.com/document/d/1nW3jNyi2zu9wtNK_g3wg7FZNdnz-YOcI/edit?tab=t.0' },
        { name: '11 клас', link: 'https://docs.google.com/document/d/1XaufuMBeRIIUrcgK-8WiV6EJGz3h770c/edit?tab=t.0' }
      ],
      order: 3
    },
    {
      name: 'Захист України',
      url: 'https://docs.google.com/document/d/1sIP5H3jWHu5cwx7eC5hHWAqBAeBH_fGK/edit?tab=t.0',
      color: '#96CEB4',
      hasSubItems: false,
      subItems: [],
      order: 4
    },
    {
      name: 'Зарубіжна література',
      url: 'https://docs.google.com/document/d/1dJnzygZ1kQ4sHPjW9xBbK_T10RuJA_9P/edit?tab=t.0',
      color: '#FFEAA7',
      hasSubItems: false,
      subItems: [],
      order: 5
    },
    {
      name: 'Інформатика',
      url: 'https://drive.google.com/file/d/1EAAajvlYg_1zJCzuVZ_qjXPAszv8FQ5p/view',
      color: '#DDA0DD',
      hasSubItems: false,
      subItems: [],
      order: 6
    },
    {
      name: 'Інформатика (практичні роботи)',
      url: 'https://docs.google.com/document/d/1DtQZG1ZQwCSD_xw_VqxoTiRIlgwU5N21/edit?tab=t.0',
      color: '#98D8C8',
      hasSubItems: false,
      subItems: [],
      order: 7
    },
    {
      name: 'Історія',
      url: 'https://docs.google.com/document/d/1k6plDWN3x8fOUd-S7w1sF3ab8J7OfCPO/edit?tab=t.0',
      color: '#F7DC6F',
      hasSubItems: false,
      subItems: [],
      order: 8
    },
    {
      name: 'Математика',
      url: 'https://drive.google.com/file/d/1XrMDAIl2iRju4GiurByPUc-Tjij8IYJ3/view',
      color: '#BB8FCE',
      hasSubItems: false,
      subItems: [],
      order: 9
    },
    {
      name: 'Мистецтво',
      url: 'https://docs.google.com/document/d/17V1WY_7cFJnuEIZ6X1WDm1-biPbCCi0L/edit?tab=t.0',
      color: '#F8C471',
      hasSubItems: false,
      subItems: [],
      order: 10
    },
    {
      name: 'Музичне мистецтво',
      url: 'https://docs.google.com/document/d/1Ra46tvKN4oXJo96SGpW-hB-t0n_U23el/edit?tab=t.0',
      color: '#85C1E9',
      hasSubItems: false,
      subItems: [],
      order: 11
    },
    {
      name: 'Образотворче мистецтво',
      url: 'https://docs.google.com/document/d/1UCI85apieSJc1QZp0sduh_dWNcnIZ_x5/edit?tab=t.0',
      color: '#F1948A',
      hasSubItems: false,
      subItems: [],
      order: 12
    },
    {
      name: 'Основи здоровя',
      url: 'https://docs.google.com/document/d/1nObwvxj2MkUNJIjVQlyNPTmcGnr4wOun/edit?tab=t.0',
      color: '#82E0AA',
      hasSubItems: false,
      subItems: [],
      order: 13
    },
    {
      name: 'Пізнаємо природу',
      url: 'https://docs.google.com/document/d/1dD8xRzmWIDTCmGa8iPrJzleYfozmNcjx/edit?tab=t.0',
      color: '#F7DC6F',
      hasSubItems: false,
      subItems: [],
      order: 14
    },
    {
      name: 'Пізнаємо природу (5-6 класи)',
      url: 'https://docs.google.com/document/d/1MnrHZG1zZZzHIekC_DRxd6gQqTsKenCw/edit?tab=t.0#heading=h.gjdgxs',
      color: '#A9DFBF',
      hasSubItems: false,
      subItems: [],
      order: 15
    },
    {
      name: 'Трудове навчання',
      url: 'https://drive.google.com/file/d/1QREZQ7wOQjItM9pCKVEHNBht6-i02FT7/view',
      color: '#D7BDE2',
      hasSubItems: false,
      subItems: [],
      order: 16
    },
    {
      name: 'Українська мова та література',
      url: 'https://docs.google.com/document/d/1ocGzJ4cmx_qrOM7czhjM3rgcE5b93MhX/edit?tab=t.0',
      color: '#FAD7A0',
      hasSubItems: false,
      subItems: [],
      order: 17
    },
    {
      name: 'Фізична культура',
      url: 'https://drive.google.com/file/d/1SHXaZoUr7Yw0h4CCuUucKbtEsaIr2vMJ/view',
      color: '#AED6F1',
      hasSubItems: false,
      subItems: [],
      order: 18
    },
    {
      name: 'Фізика',
      url: 'https://docs.google.com/document/d/1jhzMlehR0d97BJ_lKEac1woKN5JIdW65/edit?tab=t.0',
      color: '#F9E79F',
      hasSubItems: false,
      subItems: [],
      order: 19
    },
    {
      name: 'Хімія',
      url: 'https://docs.google.com/document/d/1NPFE-y0le7EQRlKDx6GzeGC4-2tNtaJ0/edit?tab=t.0',
      color: '#D5A6BD',
      hasSubItems: false,
      subItems: [],
      order: 20
    }
  ];

  for (const criteria of initialCriteria) {
    const subItemsString = JSON.stringify(criteria.subItems);
    
    await prisma.evaluationCriteria.create({
      data: {
        name: criteria.name,
        url: criteria.url,
        color: criteria.color,
        hasSubItems: criteria.hasSubItems,
        subItems: subItemsString,
        order: criteria.order
      }
    });
    
    console.log(`✅ Створено: ${criteria.name}`);
  }

  console.log('🎉 Ініціалізація критеріїв оцінювання завершена!');
}

main()
  .catch((e) => {
    console.error('❌ Помилка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
