# ToDo:

- где хранить спец. наименования пропсов для определенных категорий? server\utils\useCatProps.js
- подкатегория: товары не найдены -> Ошибка (также проверить фильтр, если не будет активных значений для категории)

  2 варианта создания подкатегорий:

  1. Как алгоритм выбора. До товара один путь. (Нутромеры индикаторные 0.01 мм (стрелочные; электронные); Нутромеры индикаторные высокоточные 0.002 и 0.001 мм (стрелочные; электронные); Нутромеры микрометрические)
  2. Максимальное разнообразие. До товара много путей, и соответственно у товара много категорий. (Нутромеры индикаторные (стрелочные, электронные, высокоточные); Нутромеры с ценой деления 0.01 (индикаторые, микрометрические, электронные); Нутромеры с ценой деления 0.002 и 0.001 (стрелочные, электронные); Нутромеры электронные; Нутромеры микрометрические)

ImageViewer:

- запретить выделение

# RoadMap:

- расставить пропсы в подкатегориях, создать под-подкатегории

search:
категории: возможно убрать indeterminate и изменение родителей (будет понятно после окончательного формирования категорий, будут ли подкатегории на 100% покрывать родителей) (наверно лучше убрать совсем фильтр с подкатегорий, оставив только главные, и добавить линки)
админка:
товары - инфо
товары - цены
алиасы через middleware?

# ТЕЗИСЫ

Все товары принадлежат категориям (не подкатегориям).
Подкатегории характеризуются параметрами, по которым проверяется, входит ли товар в данную подкатегорию. Таким образом, один товар может входить в несколько подкатегорий. То есть все подкатегории – это виртуальные категории.
При запросе подкатегории ей отдаются все товары из главной категории, и фильтр с активированными нужными для данной подкатегории параметрами.
У товаров нет порядка, то есть он формируется автоматически на основе их параметров. Можно сказать, что он задается фильтром. Сначала товары сортируются по характеристикам самой первой группы фильтра, затем по характеристикам следующей группы и т.д.

## Data Fetching

Использование "голого" $fetch приводит к двойному запросу к api - с сервера и клиента.
Важно учитывать, что при использовании useAsyncData данные в объекте data передаются по ссылке. Т.е. при изменении data и повторном их запросе (например, повторном заходе на страницу) получим уже измененные данные. В том числе, если все или часть данных обернуть в ref (reactive), связь все равно останется.
Для получения данных используется компонент HelperDataFetch. Т.к. в опциях стоит deep: false, на выходе получаем shallowRef объект (реактивность реагирует только на полное изменение объекта data, но не его параметров).
Legacy: При использовании dataFetch c auth = true (=> server = false) && lazy = false необходимо отключить ssr на данной странице (в nuxt.config). Иначе при первоначальной загрузке приложения инициирование useAsyncData будет осуществляться не по ходу выполнения кода в <script setup>, а в хуке onBeforeMounted (=> await перед myFetch не будет останавливать выполнение кода). Как понимаю, чтобы не было hydration error, т.е. результат на сервере и клиенте был одинаковым. Таким образом, если на странице надо обрабатывать данные, полученные через myFetch с server = false, эта страница должна быть server = false, что логично.
Убрал auth из dataFetch. Для получения данных, требующих авторизации, использовать myFetch, который работает только на клиенте (т.к. запрос с авторизацией можно сделать только с клиента). А dataFetch в первую очередь предназначен для другого: получения данных на сервере при первоначальной загрузке и сохранения их в стейте для использования при гидрации.
Изменил myFetch. Т.к. изменил систему авторизации с двух токенов на один (куки), система проверки авторизации в myFetch стала неактуальной. Пока по прежнему работает только на клиенте, хотя это можно изменить, если возникнет потребность к примеру получать пользователя при начальной загрузке на сервере.
`about dedupe` Нужно понимать, что он относится к запросам, выполняющимся одновременно. Т.е. если есть запрос, ожидающий результат, а ниже по коду еще один такой же запрос, то для второго параметр dedupe будет бесполезен, т.к. в момент его запуска первый уже разрешится. Таким образом, для гарантированного исключения повторных запросов нужно использовать опции dedupe: 'defer' и getCachedData: key => useNuxtData(key).data?.value

## User Auth

~~Аутентификация осуществляется через 2 токена: refreshToken, который хранится в cookie, и sessionToken, который хранится в переменной user (и посылается при требующих аутентификации запросах в хедере).~~
~~Для упрощения запросов с авторизацией создал composable myFetch, который автоматически добавляет хедер с sessionToken при требующих его запросах и обрабатывает ошибки от сервера.~~
По хорошему все refreshTokens нужно хранить в базе, что позволит увеличить меры безопасности: проверять FingerPrint браузера, проверять максимальное количество токенов на пользователя, удалять все токены при подозрительной активности и т.п. (подробнее https://gist.github.com/zmts/802dc9c3510d79fd40f9dc38a12bccfc). Но пока это решил не реализовывать. Пока только проверяется signature токена и его время жизни, хранящееся в payload.
Так как я использую сильно упрощенную систему JWT-токенов (не проверяю refreshToken должным образом, отсутствует сервер авторизации, куки с refreshToken отправляется при каждом запросе, и приложение является монолитом), вполне было бы достаточно использования куки. Это упростит логику приложения, сделает возможным использование myFetch на сервере. refreshToken будет обновлять сам себя, т.е. будет включать в себя sessionToken. Но использовать JWT - это как-то "по-взрослому". И можем в будущем его использование будет оправданно, например, если перестанет быть монолитом и будет использоваться как часть приложения для мобильных девайсов, где нет куки.
Переделал систему авторизации на один токен.

## Закрытие сайта для свободного доступа

Осуществляется через глобальную серверную переменную process.env.IS_SITE_CLOSED. Код ответа сервера при закрытом сайте - 423. Проверка при запросах на сервере.
Осуществляется в server/middleware/ifSiteClosed.js. Будет пропускать только администраторов, а также запросы на вход (server/api/auth/login.js). При этом в дальнейшем при логировании если юзер окажется не админом, будет возвращена ошибка 423.
На сайте не должно быть статичных страниц (т.е. при обращении к любой странице должен быть запрос на сервер). Так гарантируется проверка на доступ к странице.

## Responsive

Добавил экраны в tailwind.config.js. Теперь можно пользоваться следующими префиксами (примеры):
@md: - только для md экранов (768 - 1023 px)
-md: - для всех экранов меньше или входящих в md (до 1023 px)
md: - для всех экранов больше или входящих в md (c 768 px). Нативный mobile-first
\*После добавления своих экранов перестал работать нативный префикс max-.. Но он полностью заменяется моим префиксом -..
Кстати, tailwind отдельно в проект устанавливать не нужно, т.к. он входит в NuxtUI.

## Обмен информацией между открытыми вкладками.

Для синхронизации во всех открытых вкладках пользовательских данных следим за localStorage.
В ключ user-event записываем следующие значения:
0 - при выходе пользователя
1- при входе
timeStamp - при обновлении данных о пользователе

## BreadCrumbs

На страницах категорий и товаров используется компонент BreadCrumbsWrapper, который по присланному ИД формирует крошки из категорий. На других страницах сейчас нет breadCrumbs. Нужны ли?

## Lazy Loading

Приставка Lazy на компонентах отменяет их предзагрузку, если их не видно на текущей странице (используются с v-if на самом компонете или родителе) или если они расположены на других страницах, на которые есть ссылки с текущей. Поэтому к примеру нет смысла использовать Lazy на компоненте TheLoader, который загружается через app.vue, а условие на показ (v-if) расположено внутри него.
Для NuxtLink аналогом Lazy является пропс :prefetch="false" (= noPrefetch). Также при prefetch: true можно использовать пропс :prefetchOn (interaction: true, visibility: true, or both) (не разобрался как работает).

## Импорт данных со старой ДБ

Brands - нельзя изменять, таблица полностью перезаписывается.
Properties - нельзя изменять, таблица полностью перезаписывается.
Products - нельзя изменять, таблица полностью перезаписывается.
Documentation - нельзя изменять, таблицы полностью перезаписываются.
Categories - строки записываются/обновляются через INSERT INTO... ON DUPLICATE KEY UPDATE. Это позволяет не обнулять пропсы в существующих категориях и не затирать добавленные вручную категории
Единственное, что пока можно делать - присвоить подкатегориям пропсы (не затрутся после обновления) и создать под-под-категории. Возможно еще сделаю редактирование цен.
Важно помнить, что при импорте товаров их ID до и после импорта могут не совпадать (если в старую базу были добавлены товары). Соответственно нужно обновлять связи, ссылающиеся на товары (например, если будет включено кеширование страниц, чистить кеш для обновления "Похожих товаров").
Для переноса категорий добавлены npm-пакеты JSDOM (парсинг описания и характеристик) и prettier (форматирование short_description, description, characteristics). После окончательного переезда базы их нужно будет удалить.

## SEO

Мета поля для категорий и товаров отсутствуют в базе. Генерация title & description осуществляется "на лету" из данных.

## Cashing

Функционал уже есть в Nuxt, нужно только настроить. Не забыть учесть не кешировать админские ресурсы.