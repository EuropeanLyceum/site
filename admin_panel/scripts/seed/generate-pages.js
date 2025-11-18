const fs = require('fs');
const path = require('path');

// Конфігурація для всіх сторінок
const pagesConfig = [
  // Прості сторінки з текстом та фото
  { name: 'innovation-activity', title: 'Інноваційна діяльність', type: 'simple' },
  { name: 'social-psychological-support', title: 'Соціально-психологічна підтримка', type: 'simple' },
  { name: 'anti-bullying', title: 'Протидія булінгу', type: 'simple' },
  { name: 'for-parents', title: 'Батькам', type: 'simple' },
  { name: 'for-students', title: 'Учням', type: 'simple' },
  
  // Сторінки з посиланнями
  { name: 'financial-reports', title: 'Фінансова звітність', type: 'links' },
  { name: 'public-information', title: 'Публічна інформація', type: 'links' },
  
  // Сторінки з новинами (фото галерея)
  { name: 'student-government', title: 'Учнівське самоврядування', type: 'news' },
  { name: 'project-research', title: 'Проєктно-дослідницька робота', type: 'news' },
  { name: 'patriotic-education', title: 'Національно-патріотичне виховання', type: 'news' },
  { name: 'clubs-studios', title: 'Клуби та студії', type: 'news' },
  { name: 'sport-life', title: 'СпортLife', type: 'news' },
  
  // Сторінки з статтяами
  { name: 'methodological-events', title: 'Основні методичні заходи', type: 'accordion' }
];

// Функція для створення сторінки
function createPage(config) {
  const pageDir = path.join(__dirname, '..', 'app', '(admin)', config.name);
  const pageFile = path.join(pageDir, 'page.tsx');
  
  // Створюємо директорію якщо не існує
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  
  let componentName = '';
  let apiEndpoint = '';
  
  switch (config.type) {
    case 'simple':
      componentName = 'SimpleContentManager';
      apiEndpoint = `/api/${config.name}`;
      break;
    case 'links':
      componentName = 'LinksManager';
      apiEndpoint = `/api/${config.name}`;
      break;
    case 'news':
      componentName = 'NewsManager';
      apiEndpoint = `/api/${config.name}`;
      break;
    case 'accordion':
      componentName = 'AccordionManager';
      apiEndpoint = `/api/accordion?category=${config.name}`;
      break;
  }
  
  const pageContent = `import ${componentName} from "@/components/${componentName}";

export default function ${config.name.charAt(0).toUpperCase() + config.name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())}Page() {
  return (
    <${componentName} 
      ${config.type === 'accordion' ? `category="${config.name}"` : `apiEndpoint="${apiEndpoint}"`}
      title="${config.title}" 
    />
  );
}
`;
  
  fs.writeFileSync(pageFile, pageContent);
  console.log(`Created page: ${config.name}`);
}

// Функція для створення API роуту
function createApiRoute(config) {
  if (config.type === 'accordion') return; // Акордеони використовують загальний API
  
  const apiDir = path.join(__dirname, '..', 'app', 'api', config.name);
  const routeFile = path.join(apiDir, 'route.ts');
  const idRouteFile = path.join(apiDir, '[id]', 'route.ts');
  
  // Створюємо директорії
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  if (!fs.existsSync(path.join(apiDir, '[id]'))) {
    fs.mkdirSync(path.join(apiDir, '[id]'), { recursive: true });
  }
  
  const modelName = config.name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
  
  const routeContent = `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ${config.name} = await prisma.${modelName}.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(${config.name});
  } catch (error) {
    console.error('Error fetching ${config.name}:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ${config.name}' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content${config.type === 'links' ? ', url' : config.type === 'simple' ? ', photoUrl' : ', photoUrls' : ''} } = body;

    const ${config.name}Item = await prisma.${modelName}.create({
      data: {
        title,
        content,
        ${config.type === 'links' ? 'url: url || null,' : config.type === 'simple' ? 'photoUrl: photoUrl || null,' : 'photoUrls,'}
      },
    });

    return NextResponse.json(${config.name}Item);
  } catch (error) {
    console.error('Error creating ${config.name}:', error);
    return NextResponse.json(
      { error: 'Failed to create ${config.name}' },
      { status: 500 }
    );
  }
}
`;
  
  const idRouteContent = `import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, content${config.type === 'links' ? ', url' : config.type === 'simple' ? ', photoUrl' : ', photoUrls' : ''} } = body;

    const ${config.name}Item = await prisma.${modelName}.update({
      where: { id },
      data: {
        title,
        content,
        ${config.type === 'links' ? 'url: url || null,' : config.type === 'simple' ? 'photoUrl: photoUrl || null,' : 'photoUrls,'}
      },
    });

    return NextResponse.json(${config.name}Item);
  } catch (error) {
    console.error('Error updating ${config.name}:', error);
    return NextResponse.json(
      { error: 'Failed to update ${config.name}' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.${modelName}.delete({
      where: { id },
    });

    return NextResponse.json({ message: '${config.name} deleted successfully' });
  } catch (error) {
    console.error('Error deleting ${config.name}:', error);
    return NextResponse.json(
      { error: 'Failed to delete ${config.name}' },
      { status: 500 }
    );
  }
}
`;
  
  fs.writeFileSync(routeFile, routeContent);
  fs.writeFileSync(idRouteFile, idRouteContent);
  console.log(`Created API routes: ${config.name}`);
}

// Генеруємо всі сторінки та API роути
console.log('Generating pages and API routes...');
pagesConfig.forEach(config => {
  createPage(config);
  createApiRoute(config);
});
console.log('Generation complete!');



