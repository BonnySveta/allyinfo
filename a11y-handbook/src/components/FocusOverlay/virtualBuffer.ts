import { VirtualNode } from './types';

export class VirtualBuffer {
  private root: VirtualNode;
  private currentNode: VirtualNode | null = null;
  private mode: 'browse' | 'focus' = 'browse';

  constructor(document: Document) {
    this.root = this.createVirtualTree(document.body);
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
    const interactiveRoles = [
      'button', 'link', 'textbox', 'checkbox', 'radio',
      'combobox', 'listbox', 'menuitem', 'menuitemcheckbox',
      'menuitemradio', 'option', 'slider', 'spinbutton',
      'switch', 'tab'
    ];

    const role = this.getRole(element);
    if (interactiveRoles.includes(role)) return true;

    if (element instanceof HTMLElement) {
      return element.tabIndex >= 0;
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
    const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
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

  private createVirtualTree(element: Element): VirtualNode {
    // Создаем узел для текущего элемента
    const node: VirtualNode = {
      element,
      role: this.getRole(element),
      children: [],
      isInteractive: this.isInteractive(element),
      isFocusable: this.isFocusable(element),
      isHidden: this.isHidden(element),
      label: this.getAccessibleName(element),
      states: this.getStates(element)
    };

    // Рекурсивно обрабатываем дочерние элементы
    Array.from(element.children)
      .filter(child => !this.isHidden(child))
      .forEach(child => {
        const childNode = this.createVirtualTree(child);
        childNode.parent = node;
        node.children.push(childNode);
      });

    return node;
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

  // Навигационные методы
  public moveNext(): VirtualNode | null {
    if (!this.currentNode) return null;
    
    // Сначала пробуем перейти к первому дочернему элементу
    if (this.currentNode.firstChild) {
      this.currentNode = this.currentNode.firstChild;
      return this.currentNode;
    }
    
    // Затем к следующему элементу на том же уровне
    if (this.currentNode.next) {
      this.currentNode = this.currentNode.next;
      return this.currentNode;
    }
    
    // Наконец, поднимаемся верх и ищем следующий элемент
    let parent = this.currentNode.parent;
    while (parent) {
      if (parent.next) {
        this.currentNode = parent.next;
        return this.currentNode;
      }
      parent = parent.parent;
    }
    
    return null;
  }

  public movePrevious(): VirtualNode | null {
    if (!this.currentNode) return null;

    // Сначала пробуем перейти к предыдущему элементу
    if (this.currentNode.previous) {
      // Если у предыдущего элемента есть дочерние элементы,
      // переходим к последнему дочернему
      let node = this.currentNode.previous;
      while (node.lastChild) {
        node = node.lastChild;
      }
      this.currentNode = node;
      return this.currentNode;
    }

    // Если нет предыдущего элемента, поднимаемся к родителю
    if (this.currentNode.parent) {
      this.currentNode = this.currentNode.parent;
      return this.currentNode;
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
    // Ищем узел в нашем виртуальном дереве
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
} 