# Список задач, которые нужно решить, но решение которых отложено "на завтра":

### Рекомендуется это прописывать именно в todo, на месте участка кода, но если нет возможности (глобальная задача), то добавлять сюда

1. привожу пример ошибки
`
2. всё что мы сделали, это импортнули из .d.ts файла зависимость (тип) без указания
приставки "type", нужно найти это ts правило и отменить его. Это супер не информативная ошибка,
а приставку type заставлять добавлять правилом eslint.
```
   ERROR in ./src/topUps/models/accountTopUps.model.ts 16:24-94
   deshopbackend   | Module not found: Error: Can't resolve '@deshopfrontend/src/utils/accountTopUps/types/accountTopUps' in '/deshopbackend/src/topUps/models'
```
3.
