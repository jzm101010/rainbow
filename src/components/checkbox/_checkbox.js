import {isArray, inArray, hx} from '../../common/_tools.js'
import instance from '../../common/_instance.js'
import { RFormItem } from '../form/_form'

var RCheckbox = Vue.extend({
  model: {
    prop: 'checkedValue',
    event: 'input',
  },
  props: {
    checkedValue: [String, Number, Boolean, Array],
    value: {
      type: [String, Number, Boolean],
      default: true,
    },
    label: [String, Number],
    indeterminate: Boolean,
    disabled: Boolean,
  },
  computed: {
    cls () {
      var cls = ['r-checkbox']

      if (this.checked){
        cls.push('r-checkbox-checked')
      }
      else {
        // if (this.indeterminate){
        //   cls.push('r-checkbox-indeterminate')
        // }
      }
      
      if (this.disabled){
        cls.push('r-checkbox-disabled')
      }

      return cls
    },
    isGroupParent () {
      return this.$parent instanceof RCheckboxGroup
    },
    realCheckedValue () {
      var checkedValue = this.checkedValue
      
      if (this.isGroupParent){
        checkedValue = this.$parent.checkedValue
      }

      return checkedValue
    },
    checked () {
      if (isArray(this.realCheckedValue)){
        return inArray(this.value, this.realCheckedValue)
      }
      else {
        return (this.value === this.realCheckedValue) || (this.realCheckedValue === true)
      }
    },
    formItem () {
      return instance.getParent(this, RFormItem)
    },
  },
  methods: {
    _setCheckedValue () {
      var checkedValue

      if (isArray(this.realCheckedValue)){
        checkedValue = this.realCheckedValue

        if (this.checked){
          var idx = checkedValue.indexOf(this.value)
          checkedValue.splice(idx, 1)
        }
        else {
          checkedValue.push(this.value)
        }
      }
      else {
        if (this.checked){
          checkedValue = ''
        }
        else {
          checkedValue = this.value
        }
      }

      if (this.isGroupParent){
        this.$parent.$emit('input', checkedValue)
      }
      else {
        this.$emit('input', checkedValue)
      }
    },
  },
  render (h) {
    var me = this

    var $checkbox = hx(`label.${this.cls.join('+')}`, {
      on: {
        click () {
          if (me.disabled){
            return
          }
          me._setCheckedValue()
          
          if (me.formItem){
            me.formItem.validate()
          }
        }
      }
    })

    $checkbox.push(
      hx('r-icon.r-checkbox-icon', {
        props: {
          type: this.checked ? 
            'android-checkbox-outline' :
            'android-checkbox-outline-blank'
        },
      })
    )

    var label = this.$slots.default || this.label
    if (label){
      $checkbox.push(
        hx('span', {}, [label])
      )
    }

    return $checkbox.resolve(h)
  }
})

var RCheckboxGroup = Vue.extend({
  model: {
    prop: 'checkedValue',
    event: 'input',
  },
  props: {
    checkedValue: [String, Number, Array],
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cls () {
      var cls = ['r-checkbox-group']

      if (this.vertical){
        cls.push('r-checkbox-group-vertical')
      }

      return cls
    },
  },
  render (h) {
    var children = this.$slots.default

    return hx(`div.${this.cls.join('+')}`, {}, [children]).resolve(h)
  }
})

Vue.component('r-checkbox', RCheckbox)
Vue.component('r-checkbox-group', RCheckboxGroup)