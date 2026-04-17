import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MembersTab } from '../components/MembersTab';
import { PartnersTab } from '../components/PartnersTab';

export default function AdminMembersPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-fade-in">
            <Tabs defaultValue="members" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="members">{t('admin.associatedMembers', 'Membres Associés')}</TabsTrigger>
                    <TabsTrigger value="partners">{t('admin.partners', 'Partenaires')}</TabsTrigger>
                </TabsList>

                <TabsContent value="members">
                    <MembersTab />
                </TabsContent>

                <TabsContent value="partners">
                    <PartnersTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
