import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Animated,
    TextInput,
    Keyboard
} from 'react-native';

import { SelectListProps } from '..';

type L1Keys = { key?: any; value?: any; disabled?: boolean | undefined }

const SelectList: React.FC<SelectListProps> = ({
    setSelected,
    placeholder,
    boxStyles,
    inputStyles,
    dropdownStyles,
    dropdownItemStyles,
    dropdownTextStyles,
    maxHeight,
    data,
    defaultOption,
    searchicon = false,
    arrowicon = false,
    closeicon = false,
    search = true,
    searchPlaceholder = "Escribe para buscar",
    notFoundText = "No data found",
    disabledItemStyles,
    disabledTextStyles,
    onSelect = () => { },
    save = 'key',
    dropdownShown = false,
    fontFamily,
    buscar,
    defaultName
}) => {

    const oldOption = React.useRef(null)
    const [_firstRender, _setFirstRender] = React.useState<boolean>(true);
    const [dropdown, setDropdown] = React.useState<boolean>(dropdownShown);
    const [selectedval, setSelectedVal] = React.useState<any>("");
    const [height, setHeight] = React.useState<number>(200)
    const animatedvalue = React.useRef(new Animated.Value(0)).current;
    const [filtereddata, setFilteredData] = React.useState(data)


    const slidedown = () => {
        setDropdown(true)
        Animated.timing(animatedvalue, {
            toValue: height,
            duration: 200,
            useNativeDriver: false,

        }).start()
    }
    const slideup = () => {

        Animated.timing(animatedvalue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,

        }).start(() => setDropdown(false))
    }

    React.useEffect(() => {
        if (maxHeight)
            setHeight(maxHeight)
    }, [maxHeight])


    React.useEffect(() => {
        setFilteredData(data);
    }, [data])


    React.useEffect(() => {
        if (_firstRender) {
            _setFirstRender(false);
            return;
        }
        onSelect()
    }, [selectedval])


    React.useEffect(() => {
        if (!_firstRender && defaultOption && oldOption.current != defaultOption.key) {
            // oldOption.current != null
            oldOption.current = defaultOption.key
            setSelected(defaultOption.key);
            setSelectedVal(defaultOption.value);
        }
        if (defaultOption && _firstRender && defaultOption.key != undefined) {

            oldOption.current = defaultOption.key
            setSelected(defaultOption.key);
            setSelectedVal(defaultOption.value);
        }

    }, [defaultOption])

    
    React.useEffect(() => {
        if (!_firstRender) {
            if (dropdownShown)
                slidedown();
            else
                slideup();

        }

    }, [dropdownShown])

    React.useEffect(() => {
        if (!_firstRender && defaultName && defaultName.activo == false) {
            if (defaultName)
                setSelectedVal(defaultName.name);
            else
            setSelectedVal('');

        }

    }, [defaultName])


    return (
        <View>
            {
                (dropdown && search)
                    ?
                    <View style={[styles.wrapper, boxStyles]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            {
                                (!searchicon)
                                    ?
                                    null
                                    :
                                    searchicon
                            }

                            <TextInput
                                placeholder={searchPlaceholder}
                                onChangeText={(val) => {
                                    let result = data.filter((item: L1Keys) => {
                                        val.toLowerCase();
                                        let row = item.value.toLowerCase();
                                        return row.search(val.toLowerCase()) > -1;
                                    });
                                    setFilteredData(result);
                                    if (buscar) {
                                        buscar(val);
                                    }
                                }}
                                style={[{ padding: 0, height: 20, flex: 1, fontFamily }, inputStyles]}
                            />
                            <TouchableOpacity onPress={() => slideup()} >

                                {
                                    (!closeicon)
                                        ?
                                        <Image
                                            source={require('../assets/images/close.png')}
                                            resizeMode='contain'
                                            style={{ width: 30, height: 17 }}
                                        />
                                        :
                                        closeicon
                                }

                            </TouchableOpacity>


                        </View>

                    </View>
                    :
                    <TouchableOpacity style={[styles.wrapper, boxStyles]} onPress={() => { if (!dropdown) { Keyboard.dismiss(); slidedown() } else { slideup() } }}>
                        <Text
                            style={[
                                { fontFamily },
                                inputStyles,
                                selectedval === "" ? styles.placeholderStyle : null, 
                            ]}
                        >{(selectedval == "") ? (placeholder) ? placeholder : 'Selecciona una calle' : selectedval}

                        </Text>
                        {
                            (!arrowicon)
                                ?
                                <Image
                                    source={require('../assets/images/chevron.png')}
                                    resizeMode='contain'
                                    style={{ width: 30, height: 40 }}
                                />
                                :
                                arrowicon
                        }

                    </TouchableOpacity>
            }

            {
                (dropdown && search)
                    ?
                    <Animated.View style={[{ maxHeight: animatedvalue }, styles.dropdown, dropdownStyles]}>
                        <ScrollView contentContainerStyle={{ paddingVertical: 10, overflow: 'hidden' }} nestedScrollEnabled={true}>

                            {
                                (filtereddata.length >= 1)
                                    ?
                                    filtereddata.map((item: L1Keys, index: number) => {
                                        let key = item.key ?? item.value ?? item;
                                        let value = item.value ?? item;
                                        let disabled = item.disabled ?? false;
                                        if (disabled) {
                                            return (
                                                <TouchableOpacity style={[styles.disabledoption, disabledItemStyles]} key={index} onPress={() => { }}>
                                                    <Text style={[{ color: '#c4c5c6', fontFamily }, disabledTextStyles]}>{value}</Text>
                                                </TouchableOpacity>
                                            )
                                        } else {
                                            return (
                                                <TouchableOpacity style={[styles.option, dropdownItemStyles]} key={index} onPress={() => {
                                                    if (save === 'value') {
                                                        setSelected(value);
                                                    } else {
                                                        setSelected(key)
                                                    }

                                                    setSelectedVal(value)
                                                    slideup()
                                                    setTimeout(() => { setFilteredData(data) }, 800)

                                                }}>
                                                    <Text style={[{ fontFamily }, dropdownTextStyles]}>{value}</Text>
                                                </TouchableOpacity>
                                            )
                                        }

                                    })
                                    :
                                    <TouchableOpacity style={[styles.option, dropdownItemStyles]} onPress={() => {
                                        setSelected(undefined)
                                        setSelectedVal("")
                                        slideup()
                                        setTimeout(() => setFilteredData(data), 800)

                                    }}>
                                        <Text style={[{ fontFamily }, dropdownTextStyles]}>{notFoundText}</Text>
                                    </TouchableOpacity>
                            }



                        </ScrollView>
                    </Animated.View>
                    :
                    null
            }


        </View>
    )
}


export default SelectList;


const styles = StyleSheet.create({
    placeholderStyle: {
        color: '#888',
 
        fontSize: 16,
   
    },
    wrapper: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        marginBottom: 10,
        paddingLeft: 10,
        fontSize: 16,
    },
    dropdown: { marginBottom: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ccc', marginTop: 1, overflow: 'hidden' },
    option: { paddingHorizontal: 20, paddingVertical: 8, overflow: 'hidden' },
    disabledoption: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'whitesmoke', opacity: 0.9 }

})
