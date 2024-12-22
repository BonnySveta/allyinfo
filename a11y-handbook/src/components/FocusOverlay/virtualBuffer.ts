import { VirtualNode } from './types';

export class VirtualBuffer {
  private root: VirtualNode;
  private currentNode: VirtualNode | null = null;
  private mode: 'browse' | 'focus' = 'browse';

  constructor(document: Document) {
    const rootNode = this.createVirtualTree(document.body);
    if (!rootNode) {
      // Создаем корневой узел-заглушку, если не удалось создать дерево
      this.root = {
        element: document.body,
        role: 'document',
        children: [],
        isInteractive: false,
        isFocusable: false,
        isHidden: false,
        label: '',
        states: []
      };
    } else {
      this.root = rootNode;
    }
    this.setupNavigationLinks(this.root);
  }

  // Вспомогательные методы для определения свойств элементов
  private getRole(element: Element): string {
    const explicitRole = element.getAttribute('role');
    if (explicitRole) return explicitRole;

    // Маппинг HTML элементов на их роли
    const roleMap: Record<string, string> = {
      'a': 'link',
      'button': 'button',
      'h1': 'heading',
      'h2': 'heading',
      'h3': 'heading',
      'h4': 'heading',
      'h5': 'heading',
      'h6': 'heading',
      'input': 'textbox',
      'img': 'image',
      'ul': 'list',
      'ol': 'list',
      'li': 'listitem',
      'nav': 'navigation',
      'main': 'main',
      'header': 'banner',
      'footer': 'contentinfo',
    };

    return roleMap[element.tagName.toLowerCase()] || element.tagName.toLowerCase();
  }

  private isInteractive(element: Element): boolean {
    // Добавим проверку на кнопку
    if (element instanceof HTMLButtonElement) return true;

    const interactiveRoles = [
      'button', 'link', 'textbox', 'checkbox', 'radio',
      'combobox', 'listbox', 'menuitem', 'menuitemcheckbox',
      'menuitemradio', 'option', 'slider', 'spinbutton',
      'switch', 'tab'
    ];

    const role = this.getRole(element);
    if (interactiveRoles.includes(role)) return true;

    if (element instanceof HTMLElement) {
      // Проверяем tabIndex и aria-pressed
      return element.tabIndex >= 0 || element.hasAttribute('aria-pressed');
    }

    return false;
  }

  private isFocusable(element: Element): boolean {
    if (!(element instanceof HTMLElement)) return false;
    
    // Проверяем видимость
    if (this.isHidden(element)) return false;

    // Проверяем disabled
    if (element.hasAttribute('disabled')) return false;

    // Проверяем tabIndex
    if (element.tabIndex >= 0) return true;

    // Проверяем нативно фокусируемые элементы
    if (element instanceof HTMLAnchorElement) {
      // Добавляем специальную проверку для ссылок - они должны иметь href
      return element.hasAttribute('href');
    }

    const focusableTags = ['button', 'input', 'select', 'textarea'];
    return focusableTags.includes(element.tagName.toLowerCase());
  }

  private isHidden(element: Element): boolean {
    if (!(element instanceof HTMLElement)) return false;

    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return true;

    if (element.hasAttribute('hidden')) return true;
    if (element.getAttribute('aria-hidden') === 'true') return true;

    return false;
  }

  private getAccessibleName(element: Element): string {
    // Приоритет получения доступного имени по спецификации ARIA
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const labelElements = ariaLabelledBy.split(' ')
        .map(id => document.getElementById(id))
        .filter(el => el)
        .map(el => el!.textContent)
        .filter(text => text);
      
      if (labelElements.length > 0) {
        return labelElements.join(' ');
      }
    }

    if (element instanceof HTMLElement) {
      if (element.title) return element.title;
      if (element instanceof HTMLInputElement && element.placeholder) {
        return element.placeholder;
      }
    }

    return element.textContent?.trim() || '';
  }

  private getStates(element: Element): string[] {
    const states: string[] = [];

    // Проверяем различные ARIA-состояния
    const ariaStates = {
      'aria-expanded': ['expanded', 'collapsed'],
      'aria-pressed': ['pressed', 'not pressed'],
      'aria-checked': ['checked', 'unchecked'],
      'aria-required': ['required'],
      'aria-invalid': ['invalid'],
      'aria-disabled': ['disabled']
    };

    Object.entries(ariaStates).forEach(([attr, [trueName, falseName]]) => {
      const value = element.getAttribute(attr);
      if (value === 'true') {
        states.push(trueName);
      } else if (value === 'false' && falseName) {
        states.push(falseName);
      }
    });

    return states;
  }

  private shouldIncludeNode(element: Element): boolean {
    // Пропускаем скрытые элементы
    if (this.isHidden(element)) return false;

    // ВСЕГДА включаем активный элемент и кнопку скринридера
    if (element === document.activeElement || 
        element.getAttribute('aria-label') === 'Имитация скринридера') {
      return true;
    }

    // Всегда включаем интерактивные элементы
    if (this.isInteractive(element)) return true;

    // Пропускаем чисто презентационные элементы
    if (element.getAttribute('role') === 'presentation' || 
        element.getAttribute('role') === 'none') {
      return false;
    }

    // Проверяем, является ли элемент контейнером без значимого контента
    if (element instanceof HTMLElement) {
      // Проверяем наличие важных атрибутов
      if (element.hasAttribute('role') ||
          element.hasAttribute('aria-label') ||
          element.hasAttribute('aria-labelledby') ||
          element.hasAttribute('aria-describedby') ||
          element.hasAttribute('aria-live')) {
        return true;
      }

      // Для div и span нужны дополнительные проверки
      if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
        // Проверяем прямой текстовый контент
        const directTextContent = Array.from(element.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent?.trim())
          .filter(text => text && !this.isJustWhitespace(text))
          .join('');

        if (!directTextContent && !element.hasAttribute('role')) {
          return false;
        }
      }
    }

    // Всегда включаем элементы с важными ролями
    const role = this.getRole(element);
    const significantRoles = [
      'heading',
      'list',
      'listitem',
      'table',
      'row',
      'cell',
      'grid',
      'article',
      'region',
      'navigation',
      'complementary',
      'banner',
      'main',
      'contentinfo',
      'form',
      'search',
      'dialog',
      'alertdialog',
      'alert',
      'status',
      'log',
      'marquee',
      'timer'
    ];
    if (significantRoles.includes(role)) return true;

    // Включаем элементы с важными ARIA-атрибутами
    if (element.hasAttribute('aria-label') || 
        element.hasAttribute('aria-labelledby') ||
        element.hasAttribute('aria-describedby') ||
        element.hasAttribute('aria-live')) {
      return true;
    }

    // Проверяем, содержит ли элемент значимый текст
    const text = element.textContent?.trim() || '';
    if (text && !this.isJustWhitespace(text)) {
      // Проверяем, не является ли текст частью родительского элемента
      const parent = element.parentElement;
      if (parent) {
        const parentText = parent.textContent?.trim() || '';
        // Если текст элемента совпадает с родительским, пропускаем
        if (text === parentText) return false;

        // Проверяем, не является ли элемент просто оберткой
        if (element.children.length === 0 && 
            !this.isInteractive(element) && 
            !element.hasAttribute('role')) {
          return false;
        }
      }
      return true;
    }

    return false;
  }

  private isJustWhitespace(text: string): boolean {
    return !/\S/.test(text);
  }

  private mergeTextNodes(nodes: VirtualNode[]): VirtualNode[] {
    const result: VirtualNode[] = [];
    let currentTextNode: VirtualNode | null = null;

    nodes.forEach(node => {
      // Если это текстовый узел без специальной роли
      if (!node.role || node.role === 'text') {
        if (currentTextNode) {
          // Объединяем текст
          currentTextNode.label += ' ' + node.label;
        } else {
          currentTextNode = {
            ...node,
            role: 'text',
            children: []
          };
          result.push(currentTextNode);
        }
      } else {
        currentTextNode = null;
        result.push(node);
      }
    });

    return result;
  }

  private processListStructure(node: VirtualNode): VirtualNode {
    if (node.role === 'list') {
      // Получаем количество элементов списка
      const listItems = node.children.filter(child => child.role === 'listitem');
      const count = listItems.length;

      // Обновляем метку списка
      node.label = `писок из ${count} элементов${node.label ? ': ' + node.label : ''}`;

      // Обновляем каждый элемент списка
      listItems.forEach((item, index) => {
        const link = item.children.find(child => child.role === 'link');
        if (link) {
          // Обновляем только метку элемента списка, сохраняя ссылку
          item.label = `${index + 1} из ${count}: ${link.label}`;
          // НЕ удаляем ссылку из детей
          link.parent = item;
        } else {
          item.label = `${index + 1} из ${count}: ${item.label}`;
        }
      });
    }

    // Рекурсивно обрабатываем детей
    node.children = node.children.map(child => this.processListStructure(child));
    
    return node;
  }

  private processFormControls(node: VirtualNode): VirtualNode {
    // Обработка элементов формы
    if (this.isFormControl(node.element)) {
      const element = node.element as HTMLElement;
      
      // Получаем связанный label
      let labelText = '';
      if (element instanceof HTMLInputElement || 
          element instanceof HTMLSelectElement || 
          element instanceof HTMLTextAreaElement) {
        
        // Ищем label через for
        if (element.id) {
          const label = document.querySelector(`label[for="${element.id}"]`);
          if (label) {
            labelText = label.textContent?.trim() || '';
          }
        }
        
        // Ищем label через вложенность
        if (!labelText) {
          const parentLabel = element.closest('label');
          if (parentLabel) {
            labelText = parentLabel.textContent?.trim() || '';
            // Убираем текст самого элемента з label
            labelText = labelText.replace(element.textContent || '', '').trim();
          }
        }
      }

      // Обновляем метку элемента
      if (labelText) {
        node.label = `${labelText}: ${node.label}`;
      }

      // Добавляем информацию о состоянии
      if (element instanceof HTMLInputElement) {
        switch (element.type) {
          case 'checkbox':
            node.states.push(element.checked ? 'отмечено' : 'не отмечено');
            break;
          case 'radio':
            node.states.push(element.checked ? 'выбрано' : 'не выбрано');
            break;
        }

        if (element.required) {
          node.states.push('обязательное поле');
        }
      }
    }

    // Рекурсивно обрабатываем детей
    node.children = node.children.map(child => this.processFormControls(child));
    return node;
  }

  private isFormControl(element: Element): boolean {
    const formControlRoles = [
      'textbox', 'button', 'checkbox', 'radio',
      'combobox', 'listbox', 'option', 'switch'
    ];
    
    return formControlRoles.includes(this.getRole(element));
  }

  // Обработка ARIA Live Regions
  private processLiveRegions(node: VirtualNode): VirtualNode {
    const element = node.element;
    const live = element.getAttribute('aria-live');
    const atomic = element.getAttribute('aria-atomic');
    const relevant = element.getAttribute('aria-relevant');

    if (live) {
      node.isLiveRegion = true;
      node.liveSettings = {
        mode: live as 'polite' | 'assertive' | 'off',
        atomic: atomic === 'true',
        relevant: relevant?.split(' ') || ['additions', 'text']
      };

      // Добавляем информацию о live region в состояния
      node.states.push(`live ${live}`);
      if (atomic === 'true') {
        node.states.push('atomic');
      }
    }

    // Рекурсивно обрабатываем детей
    node.children = node.children.map(child => this.processLiveRegions(child));
    return node;
  }

  private processDialogs(node: VirtualNode): VirtualNode {
    const element = node.element;
    const role = this.getRole(element);

    if (role === 'dialog' || role === 'alertdialog') {
      node.isModal = true;
      
      // Проверяем, является ли диалог модальным
      const ariaModal = element.getAttribute('aria-modal') === 'true';
      if (ariaModal) {
        node.states.push('модальное окно');
      }

      // Ищем элемент с описанием диалога
      const describedBy = element.getAttribute('aria-describedby');
      if (describedBy) {
        const description = document.getElementById(describedBy)?.textContent?.trim();
        if (description) {
          node.description = description;
          node.states.push(`описание: ${description}`);
        }
      }

      // Ищем элемент, который активировал диалог
      const activator = document.querySelector('[aria-expanded="true"][aria-controls="' + element.id + '"]');
      if (activator) {
        node.states.push(`активировано: ${this.getAccessibleName(activator)}`);
      }
    }

    // Рекурсивно обрабатываем детей
    node.children = node.children.map(child => this.processDialogs(child));
    return node;
  }

  // Обработка ARIA-flowto и ARIA-owns
  private processAriaRelations(node: VirtualNode): VirtualNode {
    const element = node.element;

    // Обработка aria-owns
    const owns = element.getAttribute('aria-owns');
    if (owns) {
      const ownedElements = owns.split(' ')
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el instanceof HTMLElement);

      if (ownedElements.length > 0) {
        // Создаем виртуальные узлы для owned элементов и фильтруем null значения
        const ownedNodes = ownedElements
          .map(el => this.createVirtualTree(el as Element))
          .filter((node): node is VirtualNode => node !== null);

        // Теперь TypeScript знает, что ownedNodes - это VirtualNode[]
        node.children = [...node.children, ...ownedNodes];
        node.states.push(`владеет ${ownedNodes.length} элементами`);
      }
    }

    // Обработка aria-flowto
    const flowTo = element.getAttribute('aria-flowto');
    if (flowTo) {
      const flowTargets = flowTo.split(' ')
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el instanceof HTMLElement);

      if (flowTargets.length > 0) {
        node.flowTargets = flowTargets.map(el => {
          const targetNode = this.createVirtualTree(el as Element);
          return {
            element: el,
            label: this.getAccessibleName(el),
            node: targetNode
          };
        });

        // Добавляем информацию о возможных переходах
        const targetLabels = node.flowTargets.map(t => t.label).join(', ');
        node.states.push(`можно перейти к: ${targetLabels}`);
      }
    }

    // Рекурсивно обрабатываем детей
    node.children = node.children.map(child => this.processAriaRelations(child));
    return node;
  }

  private createVirtualTree(element: Element): VirtualNode | null {
    if (!this.shouldIncludeNode(element)) {
      const children: VirtualNode[] = [];
      Array.from(element.children)
        .forEach(child => {
          const childNode = this.createVirtualTree(child);
          if (childNode) {
            children.push(childNode);
          }
        });

      if (children.length === 1) {
        return children[0];
      } else if (children.length > 1) {
        return {
          element,
          role: 'group',
          children,
          isInteractive: false,
          isFocusable: false,
          isHidden: false,
          label: '',
          states: []
        };
      }
      return null;
    }

    let processedNode: VirtualNode = {
      element,
      role: this.getRole(element),
      children: [],
      isInteractive: this.isInteractive(element),
      isFocusable: this.isFocusable(element),
      isHidden: false,
      label: this.getAccessibleName(element),
      states: this.getStates(element)
    };

    // Собираем дочерние узлы
    let children: VirtualNode[] = [];
    Array.from(element.children).forEach(child => {
      const childNode = this.createVirtualTree(child);
      if (childNode) {
        childNode.parent = processedNode;
        children.push(childNode);
      }
    });

    // Объединяем последовательные текстовые узлы
    children = this.mergeTextNodes(children);
    processedNode.children = children;

    // Обрабатываем структуру списка
    processedNode = this.processListStructure(processedNode);

    // Обрабатываем формы и live regions
    processedNode = this.processFormControls(processedNode);
    processedNode = this.processLiveRegions(processedNode);

    // Обрабатываем диалоги и связи после основной обработки
    processedNode = this.processDialogs(processedNode);
    processedNode = this.processAriaRelations(processedNode);

    return processedNode;
  }

  private setupNavigationLinks(node: VirtualNode) {
    // Устанавливаем связи для навигации
    if (node.children.length > 0) {
      node.firstChild = node.children[0];
      node.lastChild = node.children[node.children.length - 1];
      
      node.children.forEach((child, index) => {
        if (index > 0) {
          child.previous = node.children[index - 1];
        }
        if (index < node.children.length - 1) {
          child.next = node.children[index + 1];
        }
      });
    }

    // Рекурсивно обрабатываем дочерние узлы
    node.children.forEach(child => this.setupNavigationLinks(child));
  }

  // Добавим вспомогательный метод для получения всех фокусируемых узлов
  private getAllFocusableNodes(): VirtualNode[] {
    const nodes: VirtualNode[] = [];
    
    const traverse = (node: VirtualNode) => {
      if (node.isFocusable || node.isInteractive) {
        nodes.push(node);
      }
      node.children.forEach(traverse);
    };
    
    traverse(this.root);
    return nodes;
  }

  // Навигационные методы
  public moveNext(): VirtualNode | null {
    if (!this.currentNode) return null;

    const allNodes = this.getAllFocusableNodes();
    const currentIndex = allNodes.indexOf(this.currentNode);
    
    if (currentIndex === -1) return null;
    
    // Ищем следующий фокусируемый элемент
    const nextNode = allNodes[currentIndex + 1];
    if (nextNode) {
      this.currentNode = nextNode;
      return nextNode;
    }
    
    // Если достигли конца, возвращаемся к началу
    if (allNodes.length > 0) {
      this.currentNode = allNodes[0];
      return allNodes[0];
    }
    
    return null;
  }

  public movePrevious(): VirtualNode | null {
    if (!this.currentNode) return null;

    const allNodes = this.getAllFocusableNodes();
    const currentIndex = allNodes.indexOf(this.currentNode);
    
    if (currentIndex === -1) return null;
    
    // Ищем предыдущий фокусируемый элемент
    const prevNode = allNodes[currentIndex - 1];
    if (prevNode) {
      this.currentNode = prevNode;
      return prevNode;
    }
    
    // Если достигли начала, переходим к концу
    if (allNodes.length > 0) {
      this.currentNode = allNodes[allNodes.length - 1];
      return allNodes[allNodes.length - 1];
    }
    
    return null;
  }

  public moveToFirstChild(): VirtualNode | null {
    if (!this.currentNode || !this.currentNode.firstChild) return null;
    this.currentNode = this.currentNode.firstChild;
    return this.currentNode;
  }

  public moveToLastChild(): VirtualNode | null {
    if (!this.currentNode || !this.currentNode.lastChild) return null;
    this.currentNode = this.currentNode.lastChild;
    return this.currentNode;
  }

  public moveToParent(): VirtualNode | null {
    if (!this.currentNode || !this.currentNode.parent) return null;
    this.currentNode = this.currentNode.parent;
    return this.currentNode;
  }

  // Методы для специфической навигации
  public moveToNextByRole(role: string): VirtualNode | null {
    let node = this.currentNode;
    while (node = this.moveNext()) {
      if (node.role === role) {
        return node;
      }
    }
    return null;
  }

  public moveToPreviousByRole(role: string): VirtualNode | null {
    let node = this.currentNode;
    while (node = this.movePrevious()) {
      if (node.role === role) {
        return node;
      }
    }
    return null;
  }

  // Добавим метод для установки текущего узла
  public setCurrentNode(element: Element): VirtualNode | null {
    // Ищем узел в нашем вртуальном дереве
    const findNode = (node: VirtualNode): VirtualNode | null => {
      if (node.element === element) return node;
      for (const child of node.children) {
        const found = findNode(child);
        if (found) return found;
      }
      return null;
    };

    const node = findNode(this.root);
    if (node) {
      this.currentNode = node;
    }
    return node;
  }

  // Добавим метод для получения текущего узла
  public getCurrentNode(): VirtualNode | null {
    return this.currentNode;
  }

  // Добавим метод для получения контекста элемента
  private getElementContext(node: VirtualNode): string {
    const contexts: string[] = [];
    let current = node;

    while (current.parent) {
      const parent = current.parent;
      
      // Добавляем контекст в зависимост от роли родителя
      switch (parent.role) {
        case 'list':
          if (current.role === 'listitem') {
            const index = parent.children.indexOf(current) + 1;
            const total = parent.children.length;
            contexts.unshift(`элемент ${index} из ${total}`);
          }
          break;
        case 'navigation':
          contexts.unshift('в навигации');
          break;
        case 'main':
          contexts.unshift('в основном контенте');
          break;
        // Добавьте другие контексты по необходимости
      }

      current = parent;
    }

    return contexts.join(', ');
  }

  // Добавляем метод для обновления live regions
  public updateLiveRegions(): void {
    const updateNode = (node: VirtualNode) => {
      if (node.isLiveRegion) {
        // Обновляем содержимое live region
        const newLabel = this.getAccessibleName(node.element);
        if (newLabel !== node.label) {
          node.label = newLabel;
          // Здесь можно добавить логику для оповещения об изменениях
          console.log(`Live region updated: ${node.label}`);
        }
      }

      node.children.forEach(updateNode);
    };

    updateNode(this.root);
  }

  // Добавляем ��етоды навигации для flowto
  public moveToFlowTarget(index: number = 0): VirtualNode | null {
    if (!this.currentNode?.flowTargets?.[index]) return null;
    
    const target = this.currentNode.flowTargets[index];
    if (target.node) {
      this.currentNode = target.node;
      return this.currentNode;
    }
    return null;
  }

  // Обновляем обработку клавиш в FocusOverlay для поддержки новой функциональности
  public handleDialogNavigation(key: string): VirtualNode | null {
    if (!this.currentNode) return null;

    switch (key) {
      case 'Escape':
        // Если мы в модальном окне, ищем родительский контент
        if (this.currentNode.isModal) {
          let parent = this.currentNode.parent;
          while (parent) {
            if (!parent.isModal) {
              this.currentNode = parent;
              return parent;
            }
            parent = parent.parent;
          }
        }
        break;
      
      case 'F1': // Пример клавиши для навигации по flow
        return this.moveToFlowTarget();
    }

    return null;
  }
} 