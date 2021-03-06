class Language {
  constructor (name, title) {
    this.name = name
    this.title = title
  }
}

const withTranslation = (...languages) => (schema) => {
  const target = {
    i18nTranslations: { type: String, hidden: true, label: 'Translations' },
    i18n: languages.reduce((t, l) => ({
      ...t,
      [l.name]: {
        active: { type: Boolean, label: `Translate to ${l.title}` },
        overrides: {}
      }
    }), {})
  }

  for (const l of languages) {
    for (const [k, v] of Object.entries(schema)) {
      const p = {
        ...v,
        dependsOn: Object.assign({}, v.dependsOn, {
          [`i18n.${l.name}.active`]: true
        })
      }
      if ('title' in v) {
        p.title = `${v.title} (${l.title})`
      }
      target.i18n[l.name].overrides[k] = p
    }
  }
  return target
}

const LANGUAGE_CN = new Language('cn', 'Chinese')
const LANGUAGE_RU = new Language('ru', 'Russian')
const LANGUAGE_DE = new Language('de', 'Deutsch')

module.exports = {
  default: withTranslation,
  all: withTranslation(
    LANGUAGE_CN,
    LANGUAGE_RU,
    LANGUAGE_DE
  )
}
