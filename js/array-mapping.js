/**
 * 指定elementが適切なvalueを返すようにHTML要素を編集する
 * @param $value
 * @param $element
 */
function setValueToElement($value, $element){
    const $mappingTagNames = [
        'INPUT',
        'SELECT'
    ];
    if (!$mappingTagNames.includes($element.tagName)) {
        return;
    }
    switch ($element.type) {
        case 'text':
            $element.setAttribute('value', $value);
            break;
        case 'select-one':
            let $options = $element.getElementsByTagName('OPTION');
            for (let $option of $options) {
                $option.removeAttribute('selected');
                if ($option.value === $value) {
                    $option.setAttribute('selected', '');
                }
            }
            break;
        case 'checkbox':
            if($value === $element.value){
                $element.setAttribute('checked','');
            }
            break;
        case 'radio':
            if($element.value === $value){
                $element.setAttribute('checked', '');
            } else {
                $element.removeAttribute('checked');
            }
    }
    $element.setAttribute('value', $value);
}

/**
 * リクエストが階層となるように名付けられたHTML要素の名前を導出する.
 * @param $key
 * @param $parent_object_names
 */
function calcLayeredName($key, $parent_object_names){
    if($parent_object_names.length === 0){
        return $key;
    }

    let $prefix = '';
    let $is_first = true;
    for(let $parent_object_name of $parent_object_names){
        if($is_first){
            $prefix = $parent_object_name;
            $is_first = false;
            continue;
        }
        $prefix = $prefix + '[' + $parent_object_name + ']'
    }
    return $prefix + '[' + $key + ']';
}

/**
 * 連想配列のキーと同名のHTML要素が連想配列のvalueを返すようにHTMLを編集する.
 * @param $array
 * @param $parent_objects
 */
function arrayMapping($array, $parent_objects) {
    if($parent_objects === undefined){
        $parent_objects = [];
    }

    for (let $key of Object.keys($array)) {
        if($key === '_token'){
            continue;
        }

        let $value = $array[$key];
        if ($value == null) {
            continue;
        }

        //値が配列か連想配列のとき、この関数を再帰的に回す
        if(typeof($value) === 'object'){
            if(Array.isArray($value)) {//配列
                for (let $child_key of Object.keys($value)) {
                    let $chile_parent_objects = $parent_objects.concat();
                    $chile_parent_objects.push($key);
                    arrayMapping($value, $chile_parent_objects);
                }
            } else {//連想配列
                let $chile_parent_objects = $parent_objects.concat();
                $chile_parent_objects.push($key);
                arrayMapping($value, $chile_parent_objects);
            }
            continue;
        }

        let $elements_name = calcLayeredName($key, $parent_objects);
        let $elements = document.getElementsByName($elements_name);
            for (let $element of $elements) {
            setValueToElement($value, $element);
        }
    }
}
