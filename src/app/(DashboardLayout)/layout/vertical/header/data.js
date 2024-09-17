// Notifications dropdown

const notifications = [
  {
    avatar: '/images/profile/user-1.jpg',
    title: 'Roman entrou para a equipe!',
    subtitle: 'Parabenize-o',
  },
  {
    avatar: '/images/profile/user-2.jpg',
    title: 'Nova mensagem recebida',
    subtitle: 'Salma enviou uma nova mensagem para você',
  },
  {
    avatar: '/images/profile/user-3.jpg',
    title: 'Novo pagamento recebido',
    subtitle: 'Verifique seus ganhos',
  },
  {
    avatar: '/images/profile/user-4.jpg',
    title: 'Jolly concluiu tarefas',
    subtitle: 'Atribua novas tarefas para ela',
  },
  {
    avatar: '/images/profile/user-1.jpg',
    title: 'Roman entrou para a equipe!',
    subtitle: 'Parabenize-o',
  },
  {
    avatar: '/images/profile/user-2.jpg',
    title: 'Nova mensagem recebida',
    subtitle: 'Salma enviou uma nova mensagem para você',
  },
  {
    avatar: '/images/profile/user-3.jpg',
    title: 'Novo pagamento recebido',
    subtitle: 'Verifique seus ganhos',
  },
  {
    avatar: '/images/profile/user-4.jpg',
    title: 'Jolly concluiu tarefas',
    subtitle: 'Atribua novas tarefas para ela',
  },
];

//
// Profile dropdown
//
const profile = [
  {
    href: '/apps/user-profile/profile',
    title: 'Meu Perfil',
    subtitle: 'Configurações da Conta',
    icon: '/images/svgs/icon-account.svg',
  },
  {
    href: '/apps/email',
    title: 'Minha Caixa de Entrada',
    subtitle: 'Mensagens e E-mails',
    icon: '/images/svgs/icon-inbox.svg',
  },
  {
    href: '/apps/tickets',
    title: 'Minhas Tarefas',
    subtitle: 'Tarefas do Dia e a Fazer',
    icon: '/images/svgs/icon-tasks.svg',
  },
];

// apps dropdown

const appsLink = [
  {
    href: '/apps/chats',
    title: 'Aplicativo de Chat',
    subtext: 'Novas mensagens recebidas',
    avatar: '/images/svgs/icon-dd-chat.svg',
  },
  {
    href: '/apps/ecommerce/shop',
    title: 'Aplicativo ecommerce',
    subtext: 'Novo estoque disponível',
    avatar: '/images/svgs/icon-dd-cart.svg',
  },
  {
    href: '/apps/notes',
    title: 'Aplicativo de Notas',
    subtext: 'Tarefas do Dia e a Fazer',
    avatar: '/images/svgs/icon-dd-invoice.svg',
  },
  {
    href: '/apps/calendar',
    title: 'Aplicativo de Calendário',
    subtext: 'Obtenha datas',
    avatar: '/images/svgs/icon-dd-date.svg',
  },
  {
    href: '/apps/contacts',
    title: 'Aplicativo de Contatos',
    subtext: '2 Contatos não salvos',
    avatar: '/images/svgs/icon-dd-mobile.svg',
  },
  {
    href: '/apps/tickets',
    title: 'Aplicativo de Tickets',
    subtext: 'Envie tickets',
    avatar: '/images/svgs/icon-dd-lifebuoy.svg',
  },
  {
    href: '/apps/email',
    title: 'Aplicativo de E-mail',
    subtext: 'Receba novos e-mails',
    avatar: '/images/svgs/icon-dd-message-box.svg',
  },
  {
    href: '/apps/blog/post',
    title: 'Aplicativo de Blog',
    subtext: 'novo blog adicionado',
    avatar: '/images/svgs/icon-dd-application.svg',
  },
];

const pageLinks = [
  {
    href: '/theme-pages/pricing',
    title: 'Página de Preços',
  },
  {
    href: '/auth/auth1/login',
    title: 'Design de Autenticação',
  },
  {
    href: '/auth/auth1/register',
    title: 'Registre-se Agora',
  },
  {
    href: '/404',
    title: 'Página de Erro 404',
  },
  {
    href: '/apps/notes',
    title: 'Aplicativo de Notas',
  },
  {
    href: '/apps/user-profile/profile',
    title: 'Aplicativo de Usuário',
  },
  {
    href: '/apps/blog/post',
    title: 'Design de Blog',
  },
  {
    href: '/apps/ecommerce/checkout',
    title: 'Carrinho de Compras',
  },
];


export { notifications, profile, pageLinks, appsLink };
