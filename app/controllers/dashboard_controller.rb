class DashboardController < ApplicationController
  before_action :set_entries, only: [:index, :create]

  def index
    @form = UserForm.new
    @criteria = 
      [
        Criteria::Text.new(id: 0, name: "Wurst 1"),
        Criteria::Text.new(id: 1, name: "Wurst 2", required: true)
      ]
  end

  def fields
    @criteria = if params[:"[criteria_attributes]"].present? && params[:commit] != "Reset"
      params[:"[criteria_attributes]"].values.map { |criteria|
        criteria_class = Criteria.type_for(criteria[:type_name])
        criteria_class.new(criteria.except(:type_name).permit(:id, :name, :field_value, :required))
      }
    else
      [
        Criteria::Text.new(id: 0, name: "Wurst 1"),
        Criteria::Text.new(id: 1, name: "Wurst 2", required: true)
      ]
    end

    @criteria.each do |criteria|
      criteria.valid?
    end
    
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update(
            'new_fields',
            partial: "dashboard/criterias",
            locals: { criteria: @criteria })
          ]
      end
    end    
  end

  def create
    @form = UserForm.new_with_permitted_params(params)
    respond_to do |format|
      if @form.save
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update(
              'new_form',
              partial: "dashboard/form",
              locals: { form: UserForm.new }),
            ]
        end
      else
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update(
              'new_form',
              partial: "dashboard/form",
              locals: { form: @form })
            ]
        end
      end
    end
  end

  private

  def form_params
    params.require(:user_form).permit(:firstname, :lastname, :salary, :framework, :check_box_test, :check_box_test2, :check_box_test3, tags:[])
  end

  def set_entries
    @entries = [
      {
        id: 1,
        name: 'Laravel',
        value: 'laravel',
        disabled: false,
      },
      {
        id: 2,
        name: 'Ruby on Rails das ist ein sehr langer name noch länger und so',
        value: 'ruby_on_rails',
        disabled: false,
      },
      {
        id: 3,
        name: 'Phoenix',
        value: 'phoenix',
        disabled: false,
      },
      {
        id: 4,
        name: 'Rust',
        value: 'rust',
        disabled: false,
      },
      {
        id: 5,
        name: 'Django',
        value: 'django',
        disabled: false,
      },
    ]
  end
end
