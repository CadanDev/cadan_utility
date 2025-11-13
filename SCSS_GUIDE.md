# 📝 Guia SCSS - Sistema de Lembretes

## 🎯 Benefícios da Conversão para SCSS

### ✅ Melhorias Implementadas:

1. **Variáveis Organizadas**: Todas as cores, espaçamentos e tamanhos de fonte centralizados
2. **Mixins Reutilizáveis**: Funções para flex, transições e responsividade
3. **Aninhamento Lógico**: Código mais limpo e hierárquico
4. **Organização por Seções**: Cada funcionalidade tem sua própria seção
5. **Responsividade Simplificada**: Mixin mobile para media queries

## 🛠️ Como Usar

### Compilação Manual:
```bash
# Compilar uma vez
sass css/styles.scss css/styles.css --style compressed

# Compilar e observar mudanças (modo watch)
sass css/styles.scss css/styles.css --style compressed --watch
```

### Usando NPM Scripts:
```bash
# Instalar dependências (opcional)
npm install

# Compilar uma vez
npm run build-css

# Modo de desenvolvimento (watch)
npm run dev
```

### Usando o arquivo .bat:
```bash
# No Windows, execute:
compile-scss.bat
```

## 📁 Estrutura do SCSS

### 🎨 Variáveis (Topo do arquivo)
- **Cores**: Primary, success, danger, bordas, textos, backgrounds
- **Espaçamentos**: Sistema consistente de spacing (xs até 3xl)
- **Fontes**: Tamanhos padronizados
- **Breakpoints**: Responsividade mobile

### 🔧 Mixins Disponíveis
- `@mixin flex-center`: Centraliza elementos com flexbox
- `@mixin flex-column-start`: Coluna flexbox alinhada ao topo
- `@mixin transition()`: Transições suaves personalizáveis
- `@mixin border-radius()`: Border radius consistente
- `@mixin mobile`: Media query mobile simplificada

### 📱 Seções Organizadas
1. **Timer de Descanso Visual**
2. **Lembretes de Remédios**
3. **Calendário** (com subestruturas aninhadas)
4. **Eventos Futuros**

## 🚀 Vantagens do Novo Sistema

### Antes (CSS):
```css
.calendar-day {
    /* propriedades */
}

.calendar-day:hover {
    /* propriedades */
}

.calendar-day.today {
    /* propriedades */
}

.calendar-day.today:hover {
    /* propriedades */
}
```

### Depois (SCSS):
```scss
.calendar-day {
    /* propriedades */
    
    &:hover {
        /* propriedades */
    }
    
    &.today {
        /* propriedades */
        
        &:hover {
            /* propriedades */
        }
    }
}
```

## 💡 Dicas de Uso

1. **Sempre edite o arquivo .scss**, nunca o .css diretamente
2. **Use as variáveis** para manter consistência
3. **Aproveite os mixins** para evitar repetição
4. **Mantenha o modo watch ativo** durante desenvolvimento
5. **Organize novos estilos** seguindo a estrutura por seções

## 🎯 Próximos Passos Sugeridos

1. Adicionar mais variáveis para tamanhos e breakpoints
2. Criar mixins para animações
3. Separar em múltiplos arquivos parciais (_partials.scss)
4. Implementar tema escuro com variáveis CSS custom properties