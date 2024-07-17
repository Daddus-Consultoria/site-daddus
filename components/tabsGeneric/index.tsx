import {Tabs, TabsList, TabsContent, TabsTrigger} from '@/components/ui/index'

const TabsGeneric:React.FC = () => {
    return (
        <Tabs defaultValue="account" className="flex flex-row w-[400px]">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Make changes to your account here.</TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
    )
}

export {TabsGeneric}