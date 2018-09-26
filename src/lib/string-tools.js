const digits = '0123456789'
const lowercase = 'abcdefghijklmnoprstuvxuyz'
const uppercase = lowercase.toUpperCase()
const special = '+/'

const base64Chars = [digits, lowercase, uppercase, special].join('')

const base62Chars = [digits, lowercase, uppercase].join('')

const base32Chars = [uppercase, digits].join('')

const createGenerator = (charset) => (length) => {
  var output = ''
  for (let i = 0; i < length; i += 1) {
    const index = Math.ceil((Math.random() * 100) % charset.length || 1) - 1
    output += charset[index]
  }
  return output
}

export const generateBase64String = createGenerator(base64Chars)

export const generateBase62String = createGenerator(base62Chars)

export const generateBase32String = createGenerator(base32Chars)

export const generateBase10String = createGenerator(digits)
